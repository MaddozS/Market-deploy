import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/servicios/general.service';
import { PublicationGet, Vendedor } from 'src/app/types';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  idToDelete = null;
  idVendedor: any;
  // Declaración de las siguientes variables para la información de la publicación

  currentImage!: string;

  constructor(
    private servicio: GeneralService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}
  mostrarMensaje(mensaje: string) {
    this._snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  irAEdicionPublicacion() {
    // Agrega aquí tu lógica para redirigir a la edición de la publicación
    this.router.navigate(['/dashboard/publicacion/formulario-publicacion']);
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const matriculaString = sessionStorage.getItem('matricula');
      if (matriculaString != null) {
        const cleanedMatriculaString = matriculaString.replace(/[^0-9]/g, ''); // Eliminar caracteres no numéricos
        const matricula: number = parseInt(cleanedMatriculaString, 10);
        this.idVendedor = params['id'];
        if (!isNaN(matricula) && matricula == params['id']) {
          this.perfilUsuario = true;
        }

        this.obtenerPublicacionesVendedor(this.idVendedor);
      }
    });
  }

  irAFormularioUsuario() {
    // Redirige al formulario de usuario
    this.router.navigate(['dashboard/usuario/formulario-usuario']);
  }
  irAFormularioProducto() {
    this.router.navigate(['dashboard/publicacion/formulario-publicacion']);
  }
  editarProducto(id: any) {
    this.router.navigate(['/dashboard/publicacion/formulario-publicacion/edit', id]);
  }
  irAVistaPublicacion(id: any) {
    this.router.navigate(['/dashboard/publicacion/vista-publicacion', id]);
  }

  seleccionarIdPublicacion($id: any) {
    this.idToDelete = $id;
  }

  eliminarPublicacion() {
    this.servicio.eliminarPublicacion(this.idToDelete).subscribe((response) => {
      this.obtenerPublicacionesVendedor(this.idVendedor);

      this.mostrarMensaje('Publicación eliminada');
    });
  }

  obtenerPublicacionesVendedor(id: any) {
    this.servicio.obtenerPublicacionesDelVendedor(id).subscribe((response) => {
      this.publicaciones = response.publicaciones;
      this.perfil = response.vendedor;
      console.log(response);
    });
  }
}
