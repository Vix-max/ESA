<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Variant;
use App\Models\Stock;
use Illuminate\Http\Request;

class StockController extends Controller
{
    public function store(Request $request)
{
    $validatedData = $request->validate([
        'item_id' => 'required|exists:items,id',
        'variant_id' => 'required|exists:variants,id',
        'stock_date' => 'required|date',
        'seller' => 'nullable|string|max:255',
        'buy_price' => 'required|numeric',
        'quantity' => 'required|integer|min:1',
    ]);

    // Save stock details
    $stock = Stock::create($validatedData);

    // Update stock quantity and average cost in the variant table
    $variant = Variant::find($validatedData['variant_id']);
    $variant->stock_amount += $validatedData['quantity'];

    // Recalculate average cost
    $variant->average_cost = $this->calculateAverageCost($validatedData['variant_id']);
    $variant->save();

    return response()->json([
        'message' => 'Stock added successfully',
        'stock' => $stock,
    ], 201);
}

/**
 * Calculate the average cost of a variant using all its stock buy prices.
 *
 * @param int $variantId
 * @return float
 */
private function calculateAverageCost($variantId)
{
    $stocks = Stock::where('variant_id', $variantId)->get();

    if ($stocks->isEmpty()) {
        return 0;
    }

    // Calculate total cost and total quantity
    $totalCost = 0;
    $totalQuantity = 0;

    foreach ($stocks as $stock) {
        $totalCost += $stock->buy_price * $stock->quantity;
        $totalQuantity += $stock->quantity;
    }

    return $totalQuantity > 0 ? round($totalCost / $totalQuantity, 2) : 0;
}


    public function getStockDetails($itemId, $variantId)
{
    // Retrieve stocks related to a specific item and variant
    $stocks = Stock::where('variant_id', $variantId)->get();

    // Fetch item and variant details
    $item = Item::find($itemId);
    $variant = Variant::find($variantId);

    if (!$item || !$variant) {
        return response()->json([
            'success' => false,
            'message' => 'Item or Variant not found!',
        ], 404);
    }

    return response()->json([
        'success' => true,
        'item' => $item,
        'variant' => $variant,
        'stocks' => $stocks,
    ]);
}

}
