<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = ['user_id'];

    // one cart belongs to one user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // one cart has many cart items
    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function getTotalQuantity()
    {
        return $this->cartItems->sum('quantity');
    }

    public function getTotalPrice()
    {
        return $this->cartItems->sum(fn($item) => $item->quantity * $item->item->price);
    }
}
