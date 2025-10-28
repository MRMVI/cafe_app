<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'cart_id',
        'item_id',
        'quantity',
    ];

    // cart items belogs to a cart
    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }


    // cart item belongs to an item
    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}
