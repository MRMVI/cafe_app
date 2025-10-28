<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * Get the current user's cart
     */
    public function index(Request $request)
    {
        $cart = $request->user()->cart()->with('cartItems.item')->firstOrCreate([
            'user_id' => $request->user()->id
        ]);

        $message = $cart->cartItems->isEmpty()
            ? 'Your cart is empty, start adding some items!'
            : 'Here’s your cart with all your items.';

        return response()->json([
            'message' => $message,
            'data' => $cart
        ], 200);
    }


    /**
     * Store a newly created resource in storage.
     */
    // Add an item to the cart
    public function add(Request $request)
    {
        $request->validate([
            'item_id' => 'required|exists:items,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $cart = $request->user()->cart()->firstOrCreate();

        $cartItem = $cart->cartItems()->where('item_id', $request->item_id)->first();

        if ($cartItem) {
            // If item exists, just update quantity
            $cartItem->quantity = $request->quantity;
            $cartItem->save();
        } else {
            // Otherwise, create new cart item
            $cartItem = $cart->cartItems()->create([
                'item_id' => $request->item_id,
                'quantity' => $request->quantity
            ]);
        }

        // Load item relation so frontend can get name, photo, etc.
        $cartItem->load('item');

        return response()->json([
            'message' => 'Item added to cart successfully',
            'cart_item' => [
                'id' => $cartItem->id,
                'quantity' => $cartItem->quantity,
                'item' => [
                    'id' => $cartItem->item->id,
                    'name' => $cartItem->item->name,
                    'photo_path' => $cartItem->item->photo_path,
                    'price' => $cartItem->item->price
                ]
            ]
        ]);
    }


    // Remove an item from the cart
    public function remove(Request $request, $itemId)
    {
        $cart = $request->user()->cart()->firstOrCreate();
        $cartItem = $cart->cartItems()->where('item_id', $itemId)->firstOrFail();

        $cartItem->delete();

        return response()->json(['message' => 'Item removed from cart']);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $itemId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $cart = $request->user()->cart()->firstOrCreate();
        $cartItem = $cart->cartItems()->where('item_id', $itemId)->firstOrFail();

        $cartItem->quantity = $request->quantity;
        $cartItem->save();

        return response()->json(['message' => 'Quantity updated successfully']);
    }

    /**
     * Remove the specified resource from storage.
     */
    // Clear the entire cart
    public function clear(Request $request)
    {
        $cart = $request->user()->cart()->firstOrCreate();
        $cart->cartItems()->delete();

        return response()->json(['message' => 'Cart cleared successfully']);
    }
}
