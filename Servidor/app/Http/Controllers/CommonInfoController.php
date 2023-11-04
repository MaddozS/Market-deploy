<?php

namespace App\Http\Controllers;

use App\Models\Campus;
use App\Models\Facultad;
use Illuminate\Http\Request;

class CommonInfoController extends Controller
{
    public function getFilters()
    {
        $facultades = Facultad::select('idFacultad', 'nombre', 'idCampus')->get();
        $campus = Campus::select('idCampus', 'nombre')->get();

        $filtersData = [
            'campus' => $campus,
            'facultades' => $facultades
        ];

        return response()->json($filtersData);
    }

    public function getFaculties()
    {
        $facultades = Facultad::select('idFacultad', 'nombre')->get();
        return response()->json($facultades);
    }
}
