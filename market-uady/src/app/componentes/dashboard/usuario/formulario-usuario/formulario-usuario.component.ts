import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/servicios/general.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from 'src/app/servicios/updateUser';

export class Perfil {
  nombres: string;
  apellidos: string;
  idFacultad: string;
  matricula: string;
  numeroContacto: string;
  imagenPerfil: File | string | null;
  imagen: string | undefined;

  constructor() {
    this.nombres = '';
    this.apellidos = '';
    this.idFacultad = '';
    this.matricula = '';
    this.numeroContacto = '';
    this.imagenPerfil = '';
    this.imagen = '';
  }
}

@Component({
  selector: 'app-formulario-usuario',
  templateUrl: './formulario-usuario.component.html',
  styleUrls: ['./formulario-usuario.component.css'],
})
export class FormularioUsuarioComponent implements OnInit {
  perfil = new Perfil();
  formulario!: FormGroup;
  modoEdicion: boolean = false;
  facultades: any = [];
  correoFormateado: string = '';
  file!: File;

  constructor(
    private servicio: GeneralService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.formulario = new FormGroup({
      nombres: new FormControl(this.perfil.nombres),
      apellidos: new FormControl(this.perfil.apellidos),
      idFacultad: new FormControl(this.perfil.idFacultad, Validators.required),
      matricula: new FormControl(this.perfil.matricula),
      numeroContacto: new FormControl(this.perfil.numeroContacto, Validators.required),
      imagenPerfil: new FormControl(this.perfil.imagenPerfil),
    });
    this.servicio.obtenerFacultades().subscribe(
      (response) => {
        this.facultades = response;
      },
      (error) => {}
    );

    this.obtenerDatosUsuario();
  }

  obtenerDatosUsuario() {
    const matriculaString = sessionStorage.getItem('matricula');
    if (matriculaString != null) {
      const cleanedMatriculaString = matriculaString.replace(/[^0-9]/g, ''); // Eliminar caracteres no numéricos
      const matricula: number = parseInt(cleanedMatriculaString, 10);
      this.servicio.obtenerDatosUsuario(matricula).subscribe(
        (response) => {
          this.perfil = response;
          this.formulario.patchValue(this.perfil);
          this.correoFormateado = 'a ' + this.perfil.matricula + '@alumnos.uady.mx';
          console.log('Datos del usuario:', this.perfil);
        },
        (error) => {
          console.error('Error al obtener datos del usuario:', error);
        }
      );
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0]; // Obtiene el archivo seleccionado

    if (file) {
      this.file = file; // Asigna el archivo seleccionado a this.file
      const reader = new FileReader();

      reader.onload = (e: any) => {
        // Cuando se carga el archivo, actualiza la propiedad "imagen" del perfil
        this.perfil.imagen = e.target.result;
      };

      reader.readAsDataURL(file);
    }
  }

  editarPerfil() {
    this.modoEdicion = true;
  }

  mostrarMensajeError(mensaje: string) {
    // Aquí puedes agregar lógica para mostrar un mensaje de error en tu interfaz de usuario.
    // Esto podría ser un mensaje emergente, un cuadro de diálogo, una notificación, etc.
    console.error('Error: ' + mensaje);
  }

  guardarUsuario() {
    const formData = new FormData();
    formData.append('idFacultad', this.perfil.idFacultad);
    formData.append('numeroContacto', this.perfil.numeroContacto);
    if (this.file) {
      formData.append('imagenPerfil', this.file, this.file.name);
    }

    this.servicio.actualizarDatosPerfil(formData).subscribe(
      (response) => {
        this.mostrarMensaje('Usuario actualizado');
        this.sharedService.updateUser();
        this.router.navigate(['dashboard/usuario/perfil-usuario/' + this.perfil.matricula]);
      },
      (error) => {
        this.mostrarMensaje('Error al crear el usuario');
      }
    );
  }

  getCorreoFormateado(matricula: string) {
    // Agregar un espacio entre 'a' y la matrícula
    return 'a' + matricula + '@alumnos.uady.mx';
  }

  mostrarMensaje(mensaje: string, action?: string) {
    this._snackBar.open(mensaje, action || 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
