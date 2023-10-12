<?php

namespace App\Http\Controllers;

use App\Models\publication;
use App\Models\publications_image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PublicationsController extends Controller
{
    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string|max:255',
            'precio' => 'required|decimal:2|between:0,9999.99',
            'imagenes' => 'required',
            'imagenes.*' => 'required|mimes:jpg,jpeg,png|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        
        
        $publication = publication::create([
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
            'precio' => $request->precio,
            'matriculaPublicador' => auth()->user()->matricula
        ]);

        foreach ($request->file('imagenes') as $imageFile) {
            $filename = uniqid() . '.' . File::extension($imageFile->getClientOriginalName());
            Storage::disk('publications')->put($filename, file_get_contents($imageFile));
            publications_image::create([
                'nombreArchivo' => $filename,
                'idPublicacion' => $publication->id
            ]);
        }

        return response()->json(['message' => 'Publication created']);
    }
}
