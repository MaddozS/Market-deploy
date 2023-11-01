import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/servicios/general.service';
import { PublicationGet, Vendedor } from 'src/app/types';
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
  nombreFacultad: string = '';
  facultades: any[] = [];
  publicaciones: any[] = [];

  // Declaración de las siguientes variables para la información de la publicación
  publicacion: PublicationGet = {
    titulo: '',
    descripcion: '',
    precio: 0,
    categoria: 'producto',
    imagenes: [],
  };
  vendedor: Vendedor = {
    nombres: '',
    apellidos: '',
    idFacultad: 0,
    imagen: '',
    matricula: '',
    numeroContacto: '',
    facultad: {
      nombre: '',
    },
  };
  currentImage!: string;

  constructor(private servicio: GeneralService, private router: Router) {
    this.perfil = new Perfil();
  }

  getMatriculaVendedor(idVendedor: number) {
    this.servicio.obtenerPublicacion(idVendedor).subscribe({
      next: (response) => {
        const { vendedor } = response;
        // Obtiene la matrícula del vendedor
        const matriculaVendedor = vendedor ? vendedor.matricula : '';
        
        // Filtra las publicaciones basadas en la matrícula del vendedor
        this.filtrarPublicacionesPorMatricula(matriculaVendedor);
      },
      error: (error) => {
        console.log('Error al obtener la matrícula del vendedor:', error);
      },
    });
  }
  
  filtrarPublicacionesPorMatricula(matricula: string) {
    this.publicaciones = this.publicaciones.filter((publicacion: any) => {
      // Acceder a la matrícula del vendedor desde la publicación
      const matriculaVendedor = publicacion.vendedor ? publicacion.vendedor.matricula : '';
  
      // Compara la matrícula del vendedor con la matrícula obtenida
      return matriculaVendedor === matricula;
    });
  }

  irAFormularioUsuario() {
    // Redirige al formulario de usuario
    this.router.navigate(['dashboard/usuario/formulario-usuario']);
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
            const idFacultad = parseInt(this.perfil.idFacultad, 10);
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
        
        // Obtener las publicaciones del usuario
        this.servicio.obtenerPublicacionesInicio().subscribe(
          (publicacionesResponse) => {
            this.publicaciones = publicacionesResponse.publicaciones;
            console.log(this.publicaciones);
        
            // Obtiene la matrícula del vendedor para cada publicación
            this.publicaciones.forEach((publicacion: any) => {
              const idVendedor = publicacion.vendedor ? publicacion.vendedor.id : null;
              if (idVendedor) {
                this.getMatriculaVendedor(idVendedor);
              }
            });
          },
          (error) => {
            console.error('Error al obtener las publicaciones:', error);
          }
        );
        
      },
      (error) => {
        console.error('Error al obtener datos del usuario:', error);
      }
    );
  }
  
}
