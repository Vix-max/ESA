<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Invoice;


class InvoiceController extends Controller
{
    public function store(Request $request)
{
    // Validate the incoming request data
    $request->validate([
        'customerName' => 'required|string',
        'invoiceDate' => 'required|date',
        'invoiceEntries' => 'required|array',
        'invoiceEntries.*.category' => 'required|string',
        'invoiceEntries.*.brand' => 'required|string',
        'invoiceEntries.*.item' => 'required|string',
        'invoiceEntries.*.variant' => 'required|string',
        'invoiceEntries.*.quantity' => 'required|integer',
        'invoiceEntries.*.buyPrice' => 'required|numeric',
        'invoiceEntries.*.sellPrice' => 'required|numeric',
    ]);

    // Calculate the total amount
    $totalAmount = 0;
    foreach ($request->invoiceEntries as $entry) {
        $totalAmount += $entry['quantity'] * $entry['sellPrice'];
    }

    // Create the invoice and store the total amount
    $invoice = Invoice::create([
        'customer_name' => $request->customerName,
        'invoice_date' => $request->invoiceDate,
        'total_amount' => $totalAmount, // Store the total amount
    ]);

    // Save the invoice entries
    foreach ($request->invoiceEntries as $entry) {
        $invoice->entries()->create([
            'category' => $entry['category'],
            'brand' => $entry['brand'],
            'item' => $entry['item'],
            'variant' => $entry['variant'],
            'quantity' => $entry['quantity'],
            'buy_price' => $entry['buyPrice'],
            'sell_price' => $entry['sellPrice'],
        ]);
    }

    return response()->json(['success' => true, 'message' => 'Invoice saved successfully.']);
}

public function index()
{
    // Eager load 'entries' to retrieve the related invoice entries with each invoice
    $invoices = Invoice::with('entries')->get();

    // Return the invoices along with their entries as JSON
    return response()->json([
        'invoices' => $invoices,
    ]);
}

public function show($id)
    {
        // Retrieve the invoice by ID with its related entries
        $invoice = Invoice::with('entries')->find($id);

        // Check if the invoice exists
        if (!$invoice) {
            return response()->json([
                'success' => false,
                'message' => 'Invoice not found',
            ], 404);
        }

        // Return the invoice with entries as a JSON response
        return response()->json([
            'invoice' => $invoice,
        ]);
    }

    

}
