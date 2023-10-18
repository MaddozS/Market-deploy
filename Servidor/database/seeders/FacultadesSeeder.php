<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FacultadesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['idFacultad'=>1, 'nombre' => 'Facultad de Arquitectura', 'idCampus' => 1],
            ['idFacultad'=>2, 'nombre' => 'Facultad de Medicina Veterinaria y Zootecnia', 'idCampus' => 2],
            ['idFacultad'=>3, 'nombre' => 'Facultad de Enfermería', 'idCampus' => 3],
            ['idFacultad'=>4, 'nombre' => 'Facultad de Medicina', 'idCampus' => 3],
            ['idFacultad'=>5, 'nombre' => 'Facultad de Odontología', 'idCampus' => 3],
            ['idFacultad'=>6, 'nombre' => 'Facultad de Química', 'idCampus' => 3],
            ['idFacultad'=>7, 'nombre' => 'Facultad de Ciencias Antropológicas', 'idCampus' => 4],
            ['idFacultad'=>8, 'nombre' => 'Facultad de Contaduría y Administración', 'idCampus' => 4],
            ['idFacultad'=>9, 'nombre' => 'Facultad de Derecho', 'idCampus' => 4],
            ['idFacultad'=>10, 'nombre' => 'Facultad de Economía', 'idCampus' => 4],
            ['idFacultad'=>11, 'nombre' => 'Facultad de Educación', 'idCampus' => 4],
            ['idFacultad'=>12, 'nombre' => 'Facultad de Psicología', 'idCampus' => 4],
            ['idFacultad'=>13, 'nombre' => 'Facultad de Ingeniería', 'idCampus' => 5],
            ['idFacultad'=>14, 'nombre' => 'Facultad de Ingeniería Química', 'idCampus' => 5],
            ['idFacultad'=>15, 'nombre' => 'Facultad de Matemáticas', 'idCampus' => 5],
            ['idFacultad'=>16, 'nombre' => 'Unidad Multidisciplinaria Tizimín', 'idCampus' => 6],
            ['idFacultad'=>17, 'nombre' => 'Preparatoria Uno', 'idCampus' => 7],
            ['idFacultad'=>18, 'nombre' => 'Preparatoria Dos', 'idCampus' => 7],
            ['idFacultad'=>19, 'nombre' => 'Unidad Académica de Bachillerato IC', 'idCampus' => 7]
        ];
        DB::table('facultades')->insert($data);
    }
}
