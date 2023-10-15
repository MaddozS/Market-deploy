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

    public function getPublication($idPublication)
    {
        $validator = Validator::make(['idPublication' => $idPublication], [
            'idPublication' => 'required|integer|exists:publications,idPublicacion',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $publication = publication::find($idPublication)
            ->select('titulo', 'descripcion', 'precio')->first();
        $publicationImages = publications_image::where('idPublicacion', $idPublication)->get();

        $imagesURL = [];
        foreach ($publicationImages as $imageData) {
            $imageURL = Storage::disk('publications')->url($imageData['nombreArchivo']);
            array_push($imagesURL, $imageURL);
        }
        $publication['images'] = $imagesURL;

        return json_encode($publication, JSON_UNESCAPED_SLASHES);
    }

    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'idPublication' => 'required|integer|exists:publications,idPublicacion',
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string|max:255',
            'precio' => 'required|decimal:2|between:0,9999.99',
            'imagenes' => 'required',
            'imagenes.*' => 'required|mimes:jpg,jpeg,png|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $publication = publication::find($request->idPublication);
        $publication->titulo = $request->titulo;
        $publication->descripcion = $request->descripcion;
        $publication->precio = $request->precio;
        $publication->save();

        $oldPublicationImages = publications_image::where('idPublicacion', $request->idPublication)->pluck('nombreArchivo');
        foreach ($oldPublicationImages as $oldImage) {
            Storage::disk('publications')->delete($oldImage);
        }
        publications_image::where('idPublicacion', $request->idPublication)->delete();

        foreach ($request->file('imagenes') as $imageFile) {
            $filename = uniqid() . '.' . File::extension($imageFile->getClientOriginalName());
            Storage::disk('publications')->put($filename, file_get_contents($imageFile));
            publications_image::create([
                'nombreArchivo' => $filename,
                'idPublicacion' => $request->idPublication
            ]);
        }


        return response()->json(['message' => 'Publication updated']);
    }

    public function delete($idPublication)
    {
        $validator = Validator::make(['idPublication' => $idPublication], [
            'idPublication' => 'required|integer|exists:publications,idPublicacion',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $publicationImages = publications_image::where('idPublicacion', $idPublication)->pluck('nombreArchivo');
        foreach ($publicationImages as $image) {
            Storage::disk('publications')->delete($image);
        }
        publications_image::where('idPublicacion', $idPublication)->delete();

        publication::find($idPublication)->delete();

        return response()->json(['message' => 'Publication deleted']);
    }
}
