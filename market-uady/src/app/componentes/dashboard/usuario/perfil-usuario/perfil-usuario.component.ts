import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/servicios/general.service';
import { Router } from '@angular/router';

export class Perfil {
  nombres: string;
  apellidos: string;
  idFacultad: string;
  matricula: string;
  numeroContacto: string;
  imagen: File | string;

  constructor() {
    this.nombres = '';
    this.apellidos = '';
    this.idFacultad = '';
    this.matricula = '';
    this.numeroContacto = '';
    this.imagen = '';
  }
}

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {
  perfil: Perfil;
  nombreFacultad: string = ''; // Inicializado con cadena vacía
  facultades: any[] = []; // Asegúrate de tener la lista de facultades

  constructor(private fb: FormBuilder, private servicio: GeneralService, private router: Router) {
    this.perfil = new Perfil();
    // Resto del constructor
  }

  ngOnInit() {
    // Obtener datos del usuario
    this.servicio.obtenerDatosUsuario().subscribe(
      (response) => {
        this.perfil = response;
        // Obtener la lista de facultades
        this.servicio.obtenerFacultades().subscribe(
          (facultadesResponse) => {
            this.facultades = facultadesResponse;
            // Buscar el nombre de la facultad
            console.log('Facultades:', this.facultades);
            const idFacultad = parseInt(this.perfil.idFacultad, 10); // Asegúrate de que esté en el formato correcto
            const facultad = this.facultades.find(f => f.idFacultad === idFacultad);

            if (facultad) {
              this.nombreFacultad = facultad.nombre;
            } else {
            this.nombreFacultad = 'Facultad Desconocida';
            }
          },
          (error) => {
            console.error('Error al obtener la lista de facultades:', error);
          }
        );
      },
      (error) => {
        console.error('Error al obtener datos del usuario:', error);
      }
    );
  }

  // Otras funciones y métodos
}
