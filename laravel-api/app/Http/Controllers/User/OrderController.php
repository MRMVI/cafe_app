<?php

namespace App\Http\Controllers\User;

use App\Events\OrderUpdated;
use App\Http\Controllers\Controller;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    /**
     * List all orders of the logged-in user (with pagination, filtering, and sorting)
     */
    public function index(Request $request)
    {
        // Start query for the authenticated user
        $query = $request->user()->orders()->with('orderItems.item');

        // Optional filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Sorting (default: created_at desc)
        $sortBy = $request->get('sort_by', 'created_at');
        $direction = $request->get('direction', 'desc');

        // Allow only specific columns for sorting
        if (!in_array($sortBy, ['created_at', 'total_price', 'status'])) {
            $sortBy = 'created_at';
        }

        // Allow only 'asc' or 'desc' for direction
        $direction = in_array(strtolower($direction), ['asc', 'desc']) ? $direction : 'desc';

        // Pagination (default 15 per page, max 100)
        $perPage = min($request->get('per_page', 5), 100);

        // Get paginated results
        $orders = $query->orderBy($sortBy, $direction)
            ->paginate($perPage);

        return response()->json([
            'message' => 'Orders retrieved successfully',
            'data' => $orders
        ], 200);
    }

    /**
     * Create a new order
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.quantity' => 'required|integer|min:1'
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $order = $request->user()->orders()->create([
                'status' => 'pending',
                'total_price' => 0
            ]);

            $totalPrice = 0;

            $itemIds = collect($validated['items'])->pluck('item_id');
            $items = Item::whereIn('id', $itemIds)->get()->keyBy('id');

            foreach ($validated['items'] as $orderItem) {
                $item = $items[$orderItem['item_id']];
                $quantity = $orderItem['quantity'];
                $price = $item->price * $quantity;

                $order->orderItems()->create([
                    'item_id' => $item->id,
                    'quantity' => $quantity,
                    'price' => $price
                ]);

                $totalPrice += $price;
            }

            $order->update(['total_price' => $totalPrice]);

            // Emit event for newly created order
            event(new OrderUpdated($order, 'created'));

            return response()->json([
                'message' => 'Order created successfully',
                'data' => $order->load('orderItems.item')
            ], 201);
        });
    }

    /**
     * Show a single order of the logged-in user
     */
    public function show(Request $request, string $id)
    {
        $order = $request->user()->orders()->with('orderItems.item')->findOrFail($id);

        return response()->json([
            'message' => 'Order retrieved successfully',
            'data' => $order
        ], 200);
    }

    /**
     * Update status of own order (e.g., cancel pending order)
     */
    public function update(Request $request, string $id)
    {
        $order = $request->user()->orders()->findOrFail($id);

        // Validate request: only allow cancelling
        $validated = $request->validate([
            'status' => ['required', Rule::in(['cancelled'])]
        ]);

        // Only allow cancelling if order is currently pending
        if ($order->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending orders can be cancelled'
            ], 400);
        }

        // Update order status
        $order->update(['status' => $validated['status']]);

        // Emit event for updated order
        event(new OrderUpdated($order, 'updated'));

        return response()->json([
            'message' => 'Order status updated successfully',
            'data' => $order->load('orderItems.item')
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Optional: You could allow deleting cancelled orders only
        // For example:
        /*
        $order = $request->user()->orders()->findOrFail($id);

        if ($order->status !== 'cancelled') {
            return response()->json(['message' => 'Only cancelled orders can be deleted'], 400);
        }

        $order->delete();

        event(new OrderUpdated($order, 'deleted'));

        return response()->json(['message' => 'Order deleted successfully']);
        */
    }
}
