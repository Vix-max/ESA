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

public function storeMultiple(Request $request)
{
    $validatedData = $request->validate([
        '*.item_id' => 'required|exists:items,id',
        '*.variant_id' => 'required|exists:variants,id',
        '*.stock_date' => 'required|date',
        '*.seller' => 'nullable|string|max:255',
        '*.buy_price' => 'required|numeric',
        '*.quantity' => 'required|integer|min:1',
    ]);

    $stocksToInsert = [];
    $variantUpdates = []; // Track updates for each variant_id

    foreach ($validatedData as $data) {
        // Prepare stock entry for bulk insert
        $stocksToInsert[] = [
            'item_id' => $data['item_id'],
            'variant_id' => $data['variant_id'],
            'stock_date' => $data['stock_date'],
            'seller' => $data['seller'],
            'buy_price' => $data['buy_price'],
            'quantity' => $data['quantity'],
            'created_at' => now(),
            'updated_at' => now(),
        ];

        // Track the stock amount and total cost for each variant
        if (!isset($variantUpdates[$data['variant_id']])) {
            $variantUpdates[$data['variant_id']] = [
                'total_quantity' => 0,
                'total_cost' => 0,
            ];
        }

        $variantUpdates[$data['variant_id']]['total_quantity'] += $data['quantity'];
        $variantUpdates[$data['variant_id']]['total_cost'] += $data['buy_price'] * $data['quantity'];
    }

    // Insert stock entries
    Stock::insert($stocksToInsert);

    // Update each variant separately
    foreach ($variantUpdates as $variantId => $updateData) {
        $variant = Variant::find($variantId);

        if ($variant) {
            // Existing stock details
            $existingStockAmount = $variant->stock_amount ?? 0;
            $existingAverageCost = $variant->average_cost ?? 0;

            // New stock details
            $newStockAmount = $existingStockAmount + $updateData['total_quantity'];
            $newTotalCost = ($existingAverageCost * $existingStockAmount) + $updateData['total_cost'];

            // Update the variant
            $variant->stock_amount = $newStockAmount;
            $variant->average_cost = $newStockAmount > 0 ? round($newTotalCost / $newStockAmount, 2) : 0;
            $variant->save();
        }
    }

    return response()->json([
        'message' => 'Multiple stock entries added successfully',
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
