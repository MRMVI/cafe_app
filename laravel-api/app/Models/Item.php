<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'photo_path',
        'price',
        'is_available',
        'category'
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'is_available' => 'boolean'
        ];
    }

    // categories enum
    const CATEGORY_BEVERAGES = 'beverages';
    const CATEGORY_FOOD = 'food';
    const CATEGORY_SPECIALS = 'specials/combos';
    const CATEGORY_EXTRAS = 'extras/add-ons';

    const CATEGORIES  = [
        self::CATEGORY_BEVERAGES,
        self::CATEGORY_FOOD,
        self::CATEGORY_SPECIALS,
        self::CATEGORY_EXTRAS,
    ];

    // availability constants
    const AVAILABLE = true;
    const NOT_AVAILABLE = false;
}
