import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GeneralService } from 'src/app/servicios/general.service';

export class Perfil {
  nombre: string;
  facultad: string;
  correo: string;
  numeroContacto: string;
  imagenPerfil: string;

  constructor() {
    this.nombre = '';
    this.facultad = '';
    this.correo = '';
    this.numeroContacto = '';
    this.imagenPerfil = '';
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

  constructor(private fb: FormBuilder, private servicio: GeneralService) {
    this.perfil = new Perfil();
    this.formulario = fb.group({
      nombre: [this.perfil.nombre],
      facultad: [this.perfil.facultad],
      correo: [this.perfil.correo],
      numeroContacto: [this.perfil.numeroContacto],
      imagenPerfil: [this.perfil.imagenPerfil]
    });
  }

  ngOnInit() {
    // Aquí cargas los datos del usuario existente desde el servicio
    this.obtenerDatosUsuario();
    this.servicio.obtenerFacultades().subscribe(
      (response) => {
        this.facultades = response;
      },
      (error) => {}
    );
  }

  obtenerDatosUsuario() {
    this.servicio.obtenerDatosUsuario().subscribe(
      (response) => {
        this.perfil = response;
        this.formulario.patchValue(this.perfil);
      },
      (error) => {
        console.error('Error al obtener datos del usuario:', error);
      }
    );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    // Realiza las acciones que desees con el archivo seleccionado
  }

  editarPerfil() {
    this.modoEdicion = true;
  }

  guardarCambios() {
    // Aquí implementa la lógica para guardar los cambios en el perfil
    // Debes enviar los datos actualizados a tu API mediante el servicio
    this.servicio.actualizarDatosPerfil(this.perfil).subscribe(
      (response) => {
        console.log('Datos del usuario actualizados:', response);
      },
      (error) => {
        console.error('Error al guardar los cambios:', error);
      }
    );
    this.modoEdicion = false;
  }

  
}
