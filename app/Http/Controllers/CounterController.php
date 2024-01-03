<?php

namespace App\Http\Controllers;

use App\Models\Counter;
use App\Models\Invoice;
use Illuminate\Http\Request;

class CounterController extends Controller
{
    public function create(){

        $counter = Counter::where('key', '=', 'invoice')->first();
    
        if(empty($counter)){
            $counter = Counter::create([
                'key'    => 'invoice',
                'prefix' => 'INV-',
                'value'  => '1000',
            ]);
        }

        $invoice = Invoice::OrderBy("id", "DESC")->first();
    
        if(empty($invoice)){
            $number  = $counter->value;
        }else{
            $number  = $invoice->id + 1;
            $number  = $counter->value + $number;
        }

        $response = [
                'number' => $number,
                'date'   => date('Y-m-d'),
                'terms_and_conditions' => "Deafault terms_and_conditions"
        ];

        return response()->json($response, 200);
    }
}
