<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Requests\ProductRequest;
use App\Http\Requests\UpdateProductRequest;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::latest()->paginate(10);
        $response = [
            'products_' => $products,
        ];
        return response()->json($response, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductRequest $request)
    {
        $validated = $request->validated();
        $data = [
            'item_code'     => $validated['item_code'],
            'description'   => $validated['description'],
            'unit_price'    => $validated['unit_price'],
        ];
        $customer = Product::create( $data );
        $response = [
            'product_' =>  $customer,
        ];
        return response()->json($response, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, string $id)
    {
        $validated = $request->validated();

        $data = [
            'item_code'     => $validated['item_code'],
            'description'   => $validated['description'],
            'unit_price'    => $validated['unit_price'],
        ];

        $products = Product::where('id', $id)->get();
        
        if(count( $products ) > 0) {
            $products[0]->update($data);
            $response = [
                'product_' =>  $products[0],
            ];
            return response()->json($response, 202);
        }else{
            $response = [
                'message' =>  'Product is not found',
            ];
            return response()->json($response, 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        if( $product){
            $product ->delete();
            $response = [
                'product_' =>  $product,
                'message' => 'Product is deleted',
            ];
            return response()->json($response, 200);
        }
    }
}
