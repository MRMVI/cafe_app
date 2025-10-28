<?php

namespace App\Http\Controllers\Admin;

use App\Events\OrderUpdated;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource (paginated).
     */
    public function index(Request $request)
    {
        // Start the query and eager load related models
        $query = Order::with(['user', 'orderItems.item']);

        // Filter by status if provided
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by user_id if provided
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Search by user name or email
        if ($request->filled('q')) {
            $q = $request->q;
            $query->whereHas('user', function ($userQuery) use ($q) {
                $userQuery->where('name', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $direction = $request->get('direction', 'desc');

        // Allow only specific columns for sorting
        if (!in_array($sortBy, ['created_at', 'total_price', 'status'])) {
            $sortBy = 'created_at';
        }

        // Allow only 'asc' or 'desc' for direction
        $direction = in_array(strtolower($direction), ['asc', 'desc']) ? $direction : 'desc';

        // Paginate results, default per_page = 15, max 100
        $perPage = min($request->get('per_page', 15), 100);

        $orders = $query->orderBy($sortBy, $direction)
            ->paginate($perPage);

        // Return JSON response
        return response()->json([
            'message' => 'Orders retrieved successfully',
            'data' => $orders
        ]);
    }

    /**
     * Return recent orders (non-paginated) – used by admin dashboard.
     *
     * Example: GET /api/admin/orders/recent?limit=5
     */
    public function recent(Request $request)
    {
        $limit = (int) $request->get('limit', 5);

        $orders = Order::with(['user', 'orderItems.item'])
            ->orderBy('created_at', 'desc')
            ->take($limit)
            ->get();

        return response()->json([
            'message' => 'Recent orders retrieved successfully',
            'data' => $orders
        ], 200);
    }

    /**
     * Display one order in detail
     */
    public function show(string $id)
    {
        $order = Order::with(['user', 'orderItems.item'])->findOrFail($id);

        return response()->json([
            'message' => 'Order retrieved successfully',
            'data' => $order
        ]);
    }

    /**
     * Update order status (confirm or cancel)
     */
    public function update(Request $request, string $id)
    {
        $order = Order::findOrFail($id);

        $validated = $request->validate([
            'status' => ['required', Rule::in(['confirmed', 'cancelled'])]
        ]);

        // Prevent re-finalizing already handled orders
        if (in_array($order->status, ['confirmed', 'cancelled'])) {
            return response()->json([
                'message' => 'This order has already been finalized.',
                'data' => $order
            ], 400);
        }

        $order->update(['status' => $validated['status']]);

        // Broadcast the update
        event(new OrderUpdated($order, 'updated'));

        return response()->json([
            'message' => 'Order status updated successfully',
            'data' => $order->fresh(['user', 'orderItems.item'])
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $order = Order::findOrFail($id);
        $order->delete();

        // Optionally broadcast delete
        event(new OrderUpdated($order, 'deleted'));

        return response()->json([
            'message' => 'Order deleted successfully'
        ]);
    }
}
