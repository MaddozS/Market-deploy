<?php

namespace App\Http\Controllers;

use App\Models\publication;
use App\Models\publications_image;
use App\Models\User;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
                'idPublicacion' => $publication->idPublicacion
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
            ->select('titulo', 'descripcion', 'precio', 'matriculaPublicador')->first();

        $sellerData = User::where('matricula', $publication['matriculaPublicador'])
            ->select('matricula', 'nombres', 'apellidos', 'idFacultad', 'nombreImagenPerfil', 'numeroContacto')->first();
        $sellerProfileImg = Storage::disk('profile')->url($sellerData['nombreImagenPerfil']);
        $sellerData['imagen'] = $sellerProfileImg;
        unset($sellerData['nombreImagenPerfil']);
        unset($publication['matriculaPublicador']);


        $publicationImages = publications_image::where('idPublicacion', $idPublication)->get();

        $imagesURL = [];
        foreach ($publicationImages as $imageData) {
            $imageURL = Storage::disk('publications')->url($imageData['nombreArchivo']);
            array_push($imagesURL, $imageURL);
        }
        $publication['imagenes'] = $imagesURL;
        $publicationInfo = [
            "publicacion" => $publication,
            "vendedor" => $sellerData
        ];

        return json_encode($publicationInfo, JSON_UNESCAPED_SLASHES);
    }

    public function getSellerProfile($matricula)
    {
        $validator = Validator::make(['matricula' => $matricula], [
            'matricula' => 'required|exists:users,matricula',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
        
        DB::statement("SET SQL_MODE=''"); //! Se requiere para poder obtener la query
        $sellerProfile = publication::rightJoin('publications_images', 'publications.idPublicacion', '=', 'publications_images.idPublicacion')
                                ->whereNotNull('publications.idPublicacion')
                                ->groupBy('publications.idPublicacion')
                                ->where('publications.matriculaPublicador', '=', $matricula)
                                ->select('publications.idPublicacion', 'titulo', 'precio', 'nombreArchivo')
                                ->get();
        foreach ($sellerProfile as $publicationData) {
            $imageURL = Storage::disk('publications')->url($publicationData['nombreArchivo']);
            $publicationData['image'] = $imageURL;
            unset($publicationData['nombreArchivo']);
        }

        return json_encode($sellerProfile, JSON_UNESCAPED_SLASHES);
    }

    public function mainPage(){
        $idFacultad = auth()->user()->idFacultad;

        DB::statement("SET SQL_MODE=''"); //! Se requiere para poder obtener la query
        $publications = publication::rightJoin('publications_images', 'publications.idPublicacion', '=', 'publications_images.idPublicacion')
                            ->join('users', 'users.matricula', '=', 'publications.matriculaPublicador')
                            ->where('users.idFacultad', '=', $idFacultad)
                            ->whereNotNull('publications.idPublicacion')
                            ->groupBy('publications.idPublicacion')
                            ->orderBy('idPublicacion', 'desc')
                            ->select('publications.idPublicacion', 'titulo', 'precio', 'nombreArchivo')
                            ->get();
        foreach ($publications as $publicationData) {
            $imageURL = Storage::disk('publications')->url($publicationData['nombreArchivo']);
            $publicationData['image'] = $imageURL;
            unset($publicationData['nombreArchivo']);
        }

        return json_encode($publications, JSON_UNESCAPED_SLASHES);
    }

    public function search(Request $request){
        $validator = Validator::make($request->all(), [
            'busqueda' => 'required|string',
            'filtros' => 'array',
            'filtros.*' => 'exists:facultades,idFacultad'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
        $busqueda = '%' . $request->busqueda . "%";

        DB::statement("SET SQL_MODE=''"); //! Se requiere para poder obtener la query
        
        $publications = [];
        if(isset($request->filtros)){
            $publications = publication::rightJoin('publications_images', 'publications.idPublicacion', '=', 'publications_images.idPublicacion')
                            ->join('users', 'users.matricula', '=', 'publications.matriculaPublicador')
                            ->groupBy('publications.idPublicacion')
                            ->orderBy('idPublicacion', 'desc')
                            ->where('titulo', 'like', $busqueda)
                            ->orWhere('descripcion', 'like', $busqueda)
                            ->whereNotNull('publications.idPublicacion')
                            ->whereIn('users.idFacultad', $request->filtros)
                            ->select('publications.idPublicacion', 'titulo', 'precio', 'nombreArchivo')
                            ->get();
        }else{
            $publications = publication::rightJoin('publications_images', 'publications.idPublicacion', '=', 'publications_images.idPublicacion')
                                    ->whereNotNull('publications.idPublicacion')
                                    ->groupBy('publications.idPublicacion')
                                    ->orderBy('idPublicacion', 'desc')
                                    ->where('titulo', 'like', $busqueda)
                                    ->orWhere('descripcion', 'like', $busqueda)
                                    ->select('publications.idPublicacion', 'titulo', 'precio', 'nombreArchivo', 'matriculaPublicador')
                                    ->get();

        }

        foreach ($publications as $publicationData) {
            $imageURL = Storage::disk('publications')->url($publicationData['nombreArchivo']);
            $publicationData['image'] = $imageURL;
            unset($publicationData['nombreArchivo']);
        }

        return json_encode($publications, JSON_UNESCAPED_SLASHES);
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
