<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use App\Http\Requests\CompanyRequest;
use Intervention\Image\Facades\Image;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $companies = Company::first();

        $response = [
            'company_' => $companies,
        ];

        return response()->json($response, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CompanyRequest $request)
    {
        $validated = $request->validated();

        $data = [
            'name'    => $validated['name'],
            'phone'   => $validated['phone'],
            'email'   => $validated['email'],
            'address' => $validated['address'],
        ];

        $image = "";
        if(!empty($validated['logo'])){
            $base64_pos = strpos($validated['logo'], ";base64");
            if($base64_pos){
                $base64_sub = substr($validated['logo'],0 , $base64_pos);
                $file_ext   = explode('/', $base64_sub);
                $file_name  = time().'_logo'.'.'.$file_ext[1];
                $folder     = public_path()."/images";
                $new_image  = Image::make($validated['logo'])->resize(400, 100);
                $new_image->save($folder."/".$file_name);
                $image      =  $file_name;  
            }
        }

        $data["logo"] = $image;

        $company = Company::create( $data );

        $response = [
            'company_' =>  $company,
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
    public function update(CompanyRequest $request, string $id)
    {
        $validated = $request->validated();

        $data = [
            'name'    => $validated['name'],
            'phone'   => $validated['phone'],
            'email'   => $validated['email'],
            'address' => $validated['address'],
        ];

        $company = Company::where('id', $id)->get();

        if(count( $company ) > 0) {

            if(!empty($validated['logo'])){
                $base64_pos = strpos($validated['logo'], ";base64");
                if($base64_pos){
                    $base64_sub = substr($validated['logo'],0 , $base64_pos);
                    $file_ext   = explode('/', $base64_sub);
                    $file_name  = time().'_logo'.'.'.$file_ext[1];
                    $folder     = public_path()."/images";
    
                    if(file_exists( $folder."/".$company[0]->logo )){
                        unlink( $folder."/".$company[0]->logo);
                    }
    
                    $new_image  = Image::make($validated['logo'])->resize(400, 100);
                    $new_image->save($folder."/".$file_name);
                    $image      =  $file_name;
                    
                    $company[0]->update([
                        'logo' => $image,
                    ]);
                }
            }

            $company[0]->update($data);

            $response = [
                'company_' =>  $company[0],
            ];
    
            return response()->json($response, 202);
        }else{

            $response = [
                'message' =>  'Company is not found',
            ];
    
            return response()->json($response, 404);
        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $company = Company::findOrFail($id);

        if($company){
            $company->delete();

            $response = [
                'company_' => $company,
                'message' => 'Company is deleted',
            ];

            return response()->json($response, 200);
        }
    }
}
