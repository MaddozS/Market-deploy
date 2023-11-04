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
  imagenPerfil: File | string;
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
  styleUrls: ['./formulario-usuario.component.css']
})
export class FormularioUsuarioComponent implements OnInit {
  perfil: Perfil;
  formulario: FormGroup;
  modoEdicion: boolean = false;
  facultades: any = [];
  correoFormateado: string = '';
  file!: File;

  constructor(private fb: FormBuilder, private servicio: GeneralService, private router: Router) {
    this.perfil = new Perfil();
    this.formulario = fb.group({
      nombres: [this.perfil.nombres], 
      apellidos: [this.perfil.apellidos],
      idFacultad: [this.perfil.idFacultad, Validators.required],
      matricula: [this.perfil.matricula],
      numeroContacto: [this.perfil.numeroContacto, Validators.required],
      imagenPerfil: [this.perfil.imagenPerfil],
    });
  }

  ngOnInit() {
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

  mostrarAlerta(mensaje: string) {
    // Aquí puedes agregar lógica para mostrar un mensaje de éxito en tu interfaz de usuario.
    // Esto podría ser un mensaje emergente, un cuadro de diálogo, una notificación, etc.
    console.log('Mensaje: ' + mensaje);
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
    formData.append('imagenPerfil', this.file, this.file.name);
  
    console.log(formData);
    console.log(this.perfil);
  
    this.servicio.actualizarDatosPerfil(formData).subscribe(
      (response) => {
        this.mostrarAlerta('Usuario actualizado');
        this.router.navigate(['dashboard/usuario/perfil-usuario/'+this.perfil.matricula]);
      },
      (error) => {
        this.mostrarAlerta('Error al crear el usuario');
      }
    );
  }

  getCorreoFormateado(matricula: string) {
    // Agregar un espacio entre 'a' y la matrícula
    return 'a' + matricula + '@alumnos.uady.mx';
  }
}