<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'category',
        'brand',
        'item',
        'variant',
        'quantity',
        'buy_price',
        'sell_price',
        'invoice_id',
    ];
    
    
    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

}
