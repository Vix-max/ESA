<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    // Add customer_name to the fillable property
    protected $fillable = [
        'customer_name',
        'invoice_date',
        'total_amount',
    ];

    public function entries()
{
    return $this->hasMany(InvoiceEntry::class);
}
}
