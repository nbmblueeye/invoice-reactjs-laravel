<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Customer;
use Illuminate\Http\Request;
use App\Http\Requests\InvoiceRequest;
use App\Models\InvoiceItem;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $customers = Customer::select('id', 'first_name')->get();
        $invoices = Invoice::with('customers', 'invoiceItems.products')->filter(request(['s','f']))->latest()->paginate(10);

        $response = [
            'invoices_' => $invoices,
            'customers_' => $customers,
        ];

        return response()->json($response, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(InvoiceRequest $request)
    {
        $validated = $request->validated();

        $data = [
            'number'        => $validated['number'],
            'customer_id'   => $validated['customer_id'],
            'date'          => $validated['date'],
            'due_date'      => $validated['due_date'],
            'references'    => $validated['references'] ??"",
            'terms_and_conditions' => $validated['terms_and_conditions'],
            'sub_total'     => $validated['sub_total'],
            'discount'      => $validated['discount'] ??0,
            'total'         => $validated['total'],
        ];

       $invoice = Invoice::create($data);

        if(!empty($invoice)){
            $items = json_decode($request->cartItems);
            foreach($items as $item){
                $itemData = [
                    'invoice_id' => $invoice->id,
                    'product_id' => $item->product->id,
                    'unit_price' => $item->unit_price,
                    'quantity'   => $item->quantity,
                ];
                $cartItem = InvoiceItem::create($itemData);
            }
            
        }

        $response = [
            'invoice_' => $invoice->load('customers', 'invoiceItems.products'),
        ];

        return response()->json($response, 201);

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $invoices = Invoice::with('customers', 'invoiceItems.products')->where('id', '=' , $id)->get();

        $response = [
            'invoices' => $invoices,
        ];

        return response()->json($response, 202);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(InvoiceRequest $request, string $id)
    {
        $validated = $request->validated();
        
        $data = [
            'number'        => $validated['number'],
            'customer_id'   => $validated['customer_id'],
            'date'          => $validated['date'],
            'due_date'      => $validated['due_date'],
            'references'    => $validated['references'] ??"",
            'terms_and_conditions' => $validated['terms_and_conditions'],
            'sub_total'     => $validated['sub_total'],
            'discount'      => $validated['discount'] ??0,
            'total'         => $validated['total'],
        ];

       $invoices = Invoice::where('id', '=', $id)->get();

       if(count($invoices) > 0){
            $invoices[0]->update($data);

            $invoices[0]->invoiceItems()->delete();

            $items = json_decode($request->cartItems);
            foreach($items as $item){
                $itemData = [
                    'invoice_id' => $invoices[0]->id,
                    'product_id' => $item->product->id,
                    'unit_price' => $item->unit_price,
                    'quantity'   => $item->quantity,
                ];

                $cartItem = $invoices[0]->invoiceItems()->create($itemData);
            }

            $response = [
                'invoice_' => $invoices[0]->load('customers', 'invoiceItems.products'),
            ];
    
            return response()->json($response, 201);
                
       }else{

            $response = [
                'message' => 'Invoice is not found',
            ];

            return response()->json($response, 404);
       }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $invoice = Invoice::findOrFail($id);

        if($invoice){
            $invoice->invoiceItems()->delete();
            $invoice->delete();

            $response = [
                'invoice_' => $invoice->load('customers', 'invoiceItems.products'),
                'message' => 'Invoice is deleted',
            ];

            return response()->json($response, 200);
        }
    }
}
