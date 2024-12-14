<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Item;
use App\Models\Variant; // If needed

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
            // Create the item
            $item = Item::create([
                'name' => $validated['name'],
                'category_id' => $validated['category_id'],
                'brand' => $validated['brand'],
            ]);

            // Create the variants
            foreach ($validated['variants'] as $variantData) {
                $item->variants()->create([
                    'attributes' => $variantData['attributes'],
                    'sell_price' => $variantData['sell_price'],
                    'market_price' => $variantData['market_price'],
                    'stock_amount' => $variantData['stock_amount'] ?? 0,
                ]);
            }

            // Include related data for the response
            $item->load('variants');

            // Add CORS headers to the response
            $response = response()->json([
                'success' => true,
                'message' => 'Item and variants added successfully!',
                'item' => $item,
            ], 201);

            


            return $response;
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

}