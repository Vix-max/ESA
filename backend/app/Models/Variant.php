<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Item; 

class Variant extends Model
{
    use HasFactory;

    protected $fillable = ['item_id', 'attributes', 'sell_price', 'market_price', 'stock_amount'];

    protected $casts = [
        'attributes' => 'array',  // Cast attributes to array
    ];

    public function item()
    {
        return $this->belongsTo(Item::class);  // Relationship to item
    }
}
