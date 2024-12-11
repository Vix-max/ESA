<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
{
    $categories = Category::with('attributes')->get(); // Eager load attributes

    return response()->json([
        'success' => true,
        'categories' => $categories,
    ]);
}


    public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|unique:categories',
        'description' => 'nullable|string',
        'attributes' => 'nullable|array',
    ]);

    $category = Category::create($validated);

    if (!empty($validated['attributes'])) {
        foreach ($validated['attributes'] as $attributeName) {
            $category->attributes()->create(['name' => $attributeName]);
        }
    }

    return response()->json([
        'success' => true,
        'message' => 'Category and attributes added successfully!',
        'category' => $category->load('attributes'),
    ], 201);
}


    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:categories,name,' . $id,
            'description' => 'nullable|string',
            'attributes' => 'nullable|array',
        ]);

        $category = Category::findOrFail($id);
        $category->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Category updated successfully!',
            'category' => $category,
        ]);
    }
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully!',
        ]);
    }
}
