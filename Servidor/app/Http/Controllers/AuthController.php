<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'matricula' => 'required|string|max:255',
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'correo' => 'required|email|max:255|unique:users',
            'idFacultad' => 'required|integer|min_digits:1|max_digits:2',
            'imagenPerfil' => 'required|file|mimes:jpg,jpeg,png',
            'numeroContacto' => 'required|string|min:10|max:10',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $profileImage = $request->file('imagenPerfil');

        $filename = uniqid() . '.' . File::extension($profileImage->getClientOriginalName());
        Storage::disk('profile')->put($filename, file_get_contents($profileImage));

        $user = User::create([
            'matricula' => $request->matricula,
            'nombres' => $request->nombres,
            'apellidos' => $request->apellidos,
            'correo' => $request->correo,
            'idFacultad' => $request->idFacultad,
            'nombreImagenPerfil' => $filename,
            'numeroContacto' => $request->numeroContacto,
            'password' => Hash::make($request->password)
        ]);

        $accessToken = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['token' => $accessToken, 'token_type' => 'Bearer'], 200);
    }
}
