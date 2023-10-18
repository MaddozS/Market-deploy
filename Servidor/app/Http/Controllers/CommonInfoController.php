<?php

namespace App\Http\Controllers;

use App\Models\Campu;
use App\Models\Facultade;
use Illuminate\Http\Request;

class CommonInfoController extends Controller
{
    public function getFilters()
    {
        $facultades = Facultade::select('idFacultad', 'nombre')->get();
        $campus = Campu::select('idCampus', 'nombre')->get();

        $filtersData = [
            'campus' => $campus,
            'facultades' => $facultades
        ];

        return response()->json($filtersData);
    }
}
