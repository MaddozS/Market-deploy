<?php

namespace App\Http\Controllers;

use App\Models\Facultad;
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
            $filename = 'public/images/publications/' . uniqid() . '.' . File::extension($imageFile->getClientOriginalName());
            Storage::disk('s3')->put($filename, file_get_contents($imageFile));

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
        
        // Getting publication data
        $publication = publication::where('idPublicacion', $idPublication)
            ->first();

        // Getting seller of the publication
        $sellerData = User::where('matricula', $publication['matriculaPublicador'])
            ->select('matricula', 'nombres', 'apellidos', 'idFacultad', 'nombreImagenPerfil', 'numeroContacto')->first();

        // Getting the faculty of the seller
        $faculty = Facultad::where('idFacultad', $sellerData['idFacultad'])
          ->select('nombre')
          ->first();

        $imageData = Storage::disk('s3')->temporaryUrl($sellerData['nombreImagenPerfil'], now()->addDays(5));
        $sellerData['imagen'] = $imageData;
        unset($sellerData['nombreImagenPerfil'], $publication['matriculaPublicador']);

        $sellerData['facultad'] = $faculty;

        $publicationImages = publications_image::where('idPublicacion', $idPublication)->get();

        $imagesURL = [];
        foreach ($publicationImages as $imageData) {
          $imageDataFile = Storage::disk('s3')->temporaryUrl($imageData['nombreArchivo'], now()->addDays(5));

          array_push($imagesURL, $imageDataFile);
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
        $sellerPublications = publication::rightJoin('publications_images', 'publications.idPublicacion', '=', 'publications_images.idPublicacion')
                                ->whereNotNull('publications.idPublicacion')
                                ->groupBy('publications.idPublicacion')
                                ->where('publications.matriculaPublicador', '=', $matricula)
                                ->select('publications.idPublicacion', 'titulo', 'precio', 'nombreArchivo')
                                ->get();
        foreach ($sellerPublications as $publicationData) {
          $imageData = Storage::disk('s3')->temporaryUrl($publicationData['nombreArchivo'], now()->addDays(5));
          // obtener la extension de la imagen y concatenarla a la base64
          $publicationData['image'] = $imageData;
          unset($publicationData['nombreArchivo']);
        }

        $sellerData = User::where('matricula', $matricula)
            ->select('matricula', 'nombres', 'apellidos', 'idFacultad', 'nombreImagenPerfil', 'numeroContacto')->first();

        // Getting the faculty of the seller
        $faculty = Facultad::where('idFacultad', $sellerData['idFacultad'])
          ->select('nombre')
          ->first();

        $sellerProfileImg = Storage::disk('s3')->temporaryUrl($sellerData['nombreImagenPerfil'], now()->addDays(5));
        $sellerData['imagen'] = $sellerProfileImg;
        unset($sellerData['nombreImagenPerfil']);

        $sellerData['facultad'] = $faculty;

        $data = [
            "publicaciones" => $sellerPublications,
            "vendedor" => $sellerData
        ];
        return json_encode($data, JSON_UNESCAPED_SLASHES);
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
            $imageURL = Storage::disk('s3')->temporaryUrl($publicationData['nombreArchivo'], now()->addDays(5));
            $publicationData['image'] = $imageURL;
            unset($publicationData['nombreArchivo']);
        }

        $data = [
            "publicaciones" => $publications,
            "idFacultadUsuario" => $idFacultad
        ];
        return json_encode($data, JSON_UNESCAPED_SLASHES);
    }

    public function search(Request $request){
        $validator = Validator::make($request->all(), [
            'busqueda' => 'string',
            'filtros' => 'array',
            'filtros.*' => 'exists:facultades,idFacultad'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
        

        DB::statement("SET SQL_MODE=''"); //! Se requiere para poder obtener la query
        
        $query = publication::rightJoin('publications_images', 'publications.idPublicacion', '=', 'publications_images.idPublicacion')
                ->groupBy('publications.idPublicacion')
                ->orderBy('idPublicacion', 'desc')
                ->whereNotNull('publications.idPublicacion')
                ->select('publications.idPublicacion', 'titulo', 'precio', 'nombreArchivo');
                
        if(isset($request->filtros)){
            $publications = $query->join('users', 'users.matricula', '=', 'publications.matriculaPublicador')
                            ->whereIn('users.idFacultad', $request->filtros);
        }
        
        if(isset($request->busqueda)){
            $busqueda = '%' . $request->busqueda . "%";
            $query->where('titulo', 'like', $busqueda)
                  ->orWhere('descripcion', 'like', $busqueda);
        }
        

        $publications = $query->get();

        foreach ($publications as $publicationData) {
            $imageURL = Storage::disk('s3')->temporaryUrl($publicationData['nombreArchivo'], now()->addDays(5));
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
            'imagenes' => 'nullable|array',
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

        if ($request->file('imagenes') != null) {
          
          $oldPublicationImages = publications_image::where('idPublicacion', $request->idPublication)->pluck('nombreArchivo');
          foreach ($oldPublicationImages as $oldImage) {
              Storage::disk('s3')->delete($oldImage);
          }
          publications_image::where('idPublicacion', $request->idPublication)->delete();

          foreach ($request->file('imagenes') as $imageFile) {
              $filename = 'public/images/publications/' . uniqid() . '.' . File::extension($imageFile->getClientOriginalName());
              Storage::disk('s3')->put($filename, file_get_contents($imageFile));

              publications_image::create([
                  'nombreArchivo' => $filename,
                  'idPublicacion' => $request->idPublication
              ]);
          }
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
            Storage::disk('s3')->delete($image);
        }
        publications_image::where('idPublicacion', $idPublication)->delete();

        publication::find($idPublication)->delete();

        return response()->json(['message' => 'Publication deleted']);
    }
}
