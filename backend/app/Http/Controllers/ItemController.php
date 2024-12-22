<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Item;
use App\Models\Variant; // If needed
use App\Models\Category; // If needed

class ItemController extends Controller
{
    public function store(Request $request)
    {
        \Log::info('Request payload: ', $request->all());
    
        // Validate the incoming data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'brand' => 'required|string|max:255',
            'variants' => 'required|array',
            'variants.*.attributes' => 'required|array',
            'variants.*.sell_price' => 'required|numeric|min:0',
            'variants.*.market_price' => 'required|numeric|min:0',
            'variants.*.stock_amount' => 'nullable|integer|min:0',
        ]);
    
        \Log::info('Validated data: ', $validated);
    
        try {
            // Retrieve the category name using the category_id
            $category = Category::findOrFail($validated['category_id']);
            $categoryName = $category->name;
    
            // Create the item, including the category name
            $item = Item::create([
                'name' => $validated['name'],
                'category_id' => $validated['category_id'],
                'category_name' => $categoryName, // Save category name
                'brand' => $validated['brand'],
            ]);
    
            // Create the variants
            foreach ($validated['variants'] as $variantData) {
                // Generate the structured item name for this variant
                $attributesDescription = implode(' ', array_values($variantData['attributes'])); // Concatenate attribute values
                $structuredItemName = "{$item->brand} {$item->name} {$attributesDescription}";

    
                // Create a variant
                $variant = $item->variants()->create([
                    'attributes' => $variantData['attributes'], // Temporarily store attributes
                    'sell_price' => $variantData['sell_price'],
                    'market_price' => $variantData['market_price'],
                    'stock_amount' => $variantData['stock_amount'] ?? 0,
                    'item_name' => $structuredItemName, // Add item_name without variant_id
                ]);
    
                // Get the variant ID
                $variantId = $variant->id;
    
                // Update the attributes to include the variant_id
                $updatedAttributes = array_merge($variantData['attributes'], ['variant_id' => $variantId]);
                $variant->update([
                    'attributes' => $updatedAttributes,
                ]);
    
                \Log::info('Created variant: ', $variant->toArray());
            }
    
            // Include related data for the response
            $item->load('variants');
    
            return response()->json([
                'success' => true,
                'message' => 'Item and variants added successfully!',
                'item' => $item,
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Error storing item: ', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to add item!',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    

    


    public function index()
    {
        $items = Item::with('variants')->get();

        return response()->json([
            'success' => true,
            'items' => $items,
        ]);
    }

    public function show($itemId, $variantId)
    {
        // Fetch the item by its ID
        $item = Item::find($itemId);

        // Check if the item exists
        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'Item not found!',
            ], 404);
        }

        // Find the specific variant using a where clause
        $variant = $item->variants()->where('id', $variantId)->first();

        // Check if the variant exists
        if (!$variant) {
            return response()->json([
                'success' => false,
                'message' => 'Variant not found!',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'item' => $item,
            'variant' => $variant,
        ]);
    }

    public function getByCategoryAndBrand(Request $request, $category_name, $brand)
{
    \Log::info("Fetching items for category: $category_name and brand: $brand");

    $items = Item::whereHas('category', function ($query) use ($category_name) {
        $query->where('name', $category_name); // Assuming the column in the `categories` table is `name`
    })
    ->where('brand', $brand)
    ->with('variants')
    ->get();

    if ($items->isEmpty()) {
        \Log::info("No items found for category: $category_name and brand: $brand");
        return response()->json([
            'success' => false,
            'message' => 'No items found for the specified category and brand.',
        ], 404);
    }

    \Log::info("Items found: ", $items->toArray());
    return response()->json([
        'success' => true,
        'items' => $items,
    ]);
}


    //get variants by itemID
    public function getVariantsByItemId($itemId)
{
    \Log::info("Fetching variants for item_id: $itemId");

    // Check if the item exists first
    $item = Item::find($itemId);

    if (!$item) {
        return response()->json([
            'success' => false,
            'message' => 'Item not found!',
        ], 404);
    }

    // Now fetch variants for the item
    $variants = $item->variants; // Using the relationship defined in the Item model

    \Log::info("Variants fetched: ", $variants->toArray());

    if ($variants->isEmpty()) {
        return response()->json([
            'success' => false,
            'message' => 'No variants found for this item!',
        ], 404);
    }

    return response()->json([
        'success' => true,
        'variants' => $variants,
    ]);
}

public function searchItems($searchQuery)
{
    // Search for items by "item_name" in the "variants" table
    $items = Item::with(['variants' => function ($query) use ($searchQuery) {
        $query->where('item_name', 'LIKE', '%' . $searchQuery . '%');
    }])->whereHas('variants', function ($query) use ($searchQuery) {
        $query->where('item_name', 'LIKE', '%' . $searchQuery . '%');
    })->get();

    if ($items->isEmpty()) {
        return response()->json([
            'success' => false,
            'message' => 'No items found for the given search query.',
        ], 404);
    }

    return response()->json([
        'success' => true,
        'items' => $items,
    ]);
}





}