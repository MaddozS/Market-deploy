import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/servicios/general.service';
import { PublicationGet, Vendedor } from 'src/app/types';
import { ActivatedRoute, Router } from '@angular/router';

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
  styleUrls: ['./perfil-usuario.component.css'],
})
export class PerfilUsuarioComponent implements OnInit {
  perfil: any;
  nombreFacultad = '';
  facultades: any[] = [];
  publicaciones: any[] = [];
  perfilUsuario = false;

  // Declaración de las siguientes variables para la información de la publicación

  currentImage!: string;

  constructor(
    private servicio: GeneralService,
    private router: Router,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const matriculaString = sessionStorage.getItem('matricula');
      if (matriculaString != null) {
        const cleanedMatriculaString = matriculaString.replace(/[^0-9]/g, ''); // Eliminar caracteres no numéricos
        const matricula: number = parseInt(cleanedMatriculaString, 10);
        if (!isNaN(matricula) && matricula == params['id']) {
          this.perfilUsuario = true;
        }
        this.servicio.obtenerPublicacionesDelVendedor(params['id']).subscribe((response) => {
          this.publicaciones = response.publicaciones;
          this.perfil = response.vendedor;
          console.log(response);
        });
        this.servicio.obtenerFacultades().subscribe(
          (facultadesResponse) => {
            this.facultades = facultadesResponse;
            const idFacultad = parseInt(this.perfil.idFacultad, 10);
            const facultad = this.facultades.find((f) => f.idFacultad === idFacultad);

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
      }
    });
  }

  irAFormularioUsuario() {
    // Redirige al formulario de usuario
    this.router.navigate(['dashboard/usuario/formulario-usuario']);
  }

 
}
