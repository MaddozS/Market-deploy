<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CampusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['idCampus' => 1, 'nombre'=> 'Arquitectura, Hábitat, Arte y Diseño'],
            ['idCampus' => 2, 'nombre'=> 'Ciencias Biológicas y Agropecuarias'],
            ['idCampus' => 3, 'nombre'=> 'Ciencias de la Salud'],
            ['idCampus' => 4, 'nombre'=> 'Ciencias Sociales, Económico-Administrativas y Humanidades'],
            ['idCampus' => 5, 'nombre'=> 'Ciencias Exactas e Ingenierías'],
            ['idCampus' => 6, 'nombre'=> 'Unidad Multidisciplinaria Tizimín'],
            ['idCampus' => 7, 'nombre'=> 'Preparatorias']
        ];
        DB::table('campus')->insert($data);
    }
}
