<?php

namespace App\Http\Controllers\Admin;

use App\Events\MenuUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\UpdateItemRequest;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $items = Item::all();

        return response()->json([
            'message' => 'Menu items are retrived successfully',
            'data' => $items
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreItemRequest $request)
    {
        $validated = $request->validated();

        // handle file upload
        if ($request->hasFile('photo')) {
            $validated['photo_path'] = $request->file('photo')->store('items', 'public');
        }

        $item = Item::create($validated);

        broadcast(new MenuUpdated('created', $item));

        return response()->json([
            'message' => 'Item created successfully',
            'item' => $item
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $item = Item::find($id);
        if (!$item) {
            return response()->json([
                'message' => 'Item not found.'
            ], 404);
        }

        return response()->json([
            'message' => 'Item found',
            'data' => $item
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $item = Item::find($id);
        if (!$item) {
            return response()->json(['message' => 'Item not found.'], 404);
        }

        // Validate input
        $data = $request->validate([
            'name' => 'string|max:255',
            'description' => 'string',
            'price' => 'numeric|min:0',
            'is_available' => 'required',
            'category' => 'string|max:100',
            // 'photo' => 'required|image|mimes:jpg,jpeg,png'
        ]);

        // Convert string boolean to actual boolean
        if (isset($data['is_available'])) {
            $data['is_available'] = filter_var($data['is_available'], FILTER_VALIDATE_BOOLEAN);
        }

        // Convert price to float
        // $data['price'] = (float) $data['price'];

        // Handle uploaded file
        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($item->photo_path && Storage::disk('public')->exists($item->photo_path)) {
                Storage::disk('public')->delete($item->photo_path);
            }

            // Store new photo
            $file = $request->file('photo');
            $data['photo_path'] = $file->store('items', 'public');
        }

        // Update the item
        $item->update($data);

        broadcast(new MenuUpdated('updated', $item));

        return response()->json([
            'message' => 'Item updated successfully.',
            'data' => $item,
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $item = Item::find($id);

        if (!$item) {
            return response()->json([
                'message' => 'Item not found.'
            ], 404);
        }
        // Delete old photo if exists
        if ($item->photo_path && Storage::disk('public')->exists($item->photo_path)) {
            Storage::disk('public')->delete($item->photo_path);
        }

        $item->delete();

        broadcast(new MenuUpdated('deleted', ['id' => $id]));

        return response()->json([
            'message' => 'Item deleted successfully',
        ], 200);
    }
}
