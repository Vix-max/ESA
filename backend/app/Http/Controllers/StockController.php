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

        // Update stock quantity in the variant table
        $variant = Variant::find($validatedData['variant_id']);
        $variant->stock_amount += $validatedData['quantity'];
        $variant->save();

        return response()->json([
            'message' => 'Stock added successfully',
            'stock' => $stock,
        ], 201);
    }

    public function getStocksByItem($itemId)
    {
        $stocks = Stock::where('item_id', $itemId)->get();

        return response()->json($stocks, 200);
    }
}
