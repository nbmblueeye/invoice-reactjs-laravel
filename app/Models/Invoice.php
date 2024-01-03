<?php

namespace App\Models;

use App\Models\Customer;
use Illuminate\Database\Query\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'number',
        'customer_id',
        'date',
        'due_date',
        'references',
        'terms_and_conditions',
        'sub_total',
        'discount',
        'total',
    ];

    public function customers(){
        return $this->belongsTo(Customer::class, 'customer_id', 'id');
    }

    public function invoiceItems(){
        return $this->hasMany(InvoiceItem::class, 'invoice_id', 'id');
    }

    public function scopeFilter( $query, array $filters){

        if($filters['s'] ?? false){
           $search = $filters['s'];
           $query -> where('id', 'like', '%'.$filters['s'].'%')
                  -> orWhere('date', 'like', '%'.$filters['s'].'%')
                  -> orWhere('due_date', 'like', '%'.$filters['s'].'%')
                  ->orWhereHas('customers', function($query) use ($search){
                    $query->where('first_name', 'like', '%'.$search.'%');
                  })
           ;
        }else if($filters['f'] ?? false){
            $filter = $filters['f'];
            $query->whereHas('customers', function($query) use ($filter){
                     $query->where('id', 'like', '%'.$filter.'%');
                   })
            ;
        }

    }
}
