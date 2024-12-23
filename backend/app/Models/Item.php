<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Variant; 
use App\Models\Category; 

class Item extends Model
{
    use HasFactory;

    // Add 'category_name' to the fillable attributes
    protected $fillable = ['name', 'category_id', 'category_name', 'brand'];

    public function variants()
    {
        return $this->hasMany(Variant::class, 'item_id', 'id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);  // Relationship to category
    }
}
