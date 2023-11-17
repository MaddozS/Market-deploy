<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'matricula' => 'required|string|max:255|unique:users',
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'correo' => 'required|email|max:255|unique:users',
            'idFacultad' => 'required|integer|min_digits:1|max_digits:2',
            'imagenPerfil' => 'required|file|mimes:jpg,jpeg,png',
            'numeroContacto' => 'required|string|min:10|max:10',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            for ($i = 0; $i < count($validator->errors()); $i++) {
                $error = $validator->errors()->all()[$i];
                if ($error == 'The matricula has already been taken.') {
                    return response()->json(['message' => 'Matricula ya esta registrada en el sistema'], 400);
                }
                if ($error == 'The correo has already been taken.') {
                    return response()->json(['message' => 'El correo ya está registrado en el sistema'], 400);
                }
                if ($error == 'The imagen perfil must be a file of type: jpg, jpeg, png.') {
                    return response()->json(['message' => 'La imagen de perfil debe ser un archivo de tipo: jpg, jpeg, png.'], 400);
                }
                if ($error == 'The numero contacto must be at least 10 characters.') {
                    return response()->json(['message' => 'El número de contacto debe tener al menos 10 digitos.'], 400);
                }
                if ($error == 'The numero contacto may not be greater than 10 characters.') {
                    return response()->json(['message' => 'El número de contacto no puede tener más de 10 digitos.'], 400);
                }
                if ($error == 'The password must be at least 8 characters.') {
                    return response()->json(['message' => 'La contraseña debe tener al menos 8 caracteres.'], 400);
                }
            }
            // return response()->json($validator->errors(), 400);
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

        return response()->json(['token' => $accessToken, 'token_type' => 'Bearer', 'matricula' => $user->matricula], 200);
    }

    public function login(Request $request)
    {
        if(!Auth::attempt($request->only('correo', 'password'))){
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user = User::where('correo', $request['correo'])->firstOrFail();
        $accessToken = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['token' => $accessToken, 'token_type' => 'Bearer', 'matricula' => $user->matricula], 200);
    }

    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'idFacultad' => 'required|integer|min_digits:1|max_digits:2',
            'imagenPerfil' => 'nullable|file|mimes:jpg,jpeg,png',
            'numeroContacto' => 'required|string|min:10|max:10',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
        $user = User::find(auth()->user()->id);

        $oldImageName = $user->nombreImagenPerfil;
        
        $newProfileImage = $request->file('imagenPerfil');
        if ($newProfileImage == null) {
            $newProfilefilename = $oldImageName;
        } else {
            Storage::disk('profile')->delete($oldImageName);
            $newProfilefilename = uniqid() . '.' . File::extension($newProfileImage->getClientOriginalName());
            Storage::disk('profile')->put($newProfilefilename, file_get_contents($newProfileImage));
        }
        
        $user->idFacultad = $request->idFacultad;
        $user->nombreImagenPerfil = $newProfilefilename;
        $user->numeroContacto = $request->numeroContacto;
        $user->save();

        return response()->json(['message' => 'User updated']);
    }

    public function logout(){
        auth()->user()->tokens()->delete();

        return response()->json(['message' => 'Bye']);
    }
}
