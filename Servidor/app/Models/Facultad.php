<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Facultad extends Model
{
    use HasFactory;
    protected $fillable = [
      'nombre',
      'idCampus'
    ];

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'idFacultad';
    protected $table = 'facultades';
}
