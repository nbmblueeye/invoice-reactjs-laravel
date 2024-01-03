<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use App\Http\Requests\CustomerResquest;
use App\Http\Requests\UpdateCustomerRequest;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $customers = Customer::latest()->paginate(10);

        $response = [
            'customers_' => $customers,
        ];

        return response()->json($response, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CustomerResquest $request)
    {
        
        $validated = $request->validated();

        $data = [
            'first_name'    => $validated['first_name'],
            'last_name'     => $validated['last_name'],
            'email'         => $validated['email'],
            'address'       => $validated['address'],
        ];

        $customer = Customer::create( $data );

        $response = [
            'customer_' =>  $customer,
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
    public function update(UpdateCustomerRequest $request, string $id)
    {
        $validated = $request->validated();

        $data = [
            'first_name'    => $validated['first_name'],
            'last_name'     => $validated['last_name'],
            'email'         => $validated['email'],
            'address'       => $validated['address'],
        ];

        $customer = Customer::where('id', $id)->get();

        if(count( $customer ) > 0) {

            $customer[0]->update($data);

            $response = [
                'customer_' =>  $customer[0],
            ];
    
            return response()->json($response, 202);
        }else{

            $response = [
                'message' =>  'Customer is not found',
            ];
    
            return response()->json($response, 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $customer = Customer::findOrFail($id);

        if($customer){
            $customer->delete();

            $response = [
                'customer_' => $customer,
                'message' => 'Customer is deleted',
            ];

            return response()->json($response, 200);
        }
    }
}
