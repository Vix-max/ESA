<?php
namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    public function addBrand(Request $request)
{
    try {
        // Validate the incoming request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        // Create the brand
        $brand = Brand::create($validated);

        // Return the response
        return response()->json([
            'success' => true,
            'message' => 'Brand added successfully!',
            'brand' => $brand,
        ], 201);

    } catch (\Exception $e) {
        \Log::error('Error adding brand: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Failed to add brand!',
        ], 500);
    }
}


    public function getAllBrands()
    {
        $brands = Brand::all();
        return response()->json([
            'success' => true,
            'brands' => $brands,
        ]);
    }
}
