import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { GeneralService } from 'src/app/servicios/general.service';

@Component({
  selector: 'app-formulario-usuario',
  templateUrl: './formulario-usuario.component.html',
  styleUrls: ['./formulario-usuario.component.css']
})
export class FormularioUsuarioComponent {
  formulario: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.formulario = fb.group({
      nombre: [{ value: 'Daniel Eduardo Gutierrez Delfin', disabled: true }, Validators.required],
      facultad: ['Facultad de Matemáticas', Validators.required], // Agrega otras facultades aquí
      correo: [{ value: 'a16383940@alumnos.uady.mx', disabled: true }, Validators.required],
      numeroContacto: [''],
      imagenPerfil: ['']
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    // Realiza las acciones que desees con el archivo seleccionado
  }
}
