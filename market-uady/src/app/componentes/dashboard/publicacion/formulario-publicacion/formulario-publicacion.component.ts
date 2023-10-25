import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/servicios/general.service';
import { Publicacion } from 'src/app/types';

@Component({
  selector: 'app-formulario-publicacion',
  templateUrl: './formulario-publicacion.component.html',
  styleUrls: ['./formulario-publicacion.component.css'],
})
export class FormularioPublicacionComponent {
  form!: FormGroup;
  uploadedImages: string[] = [];
  files: File[] = [];
  publicacion: Publicacion = {
    imagenes: [],
    titulo: '',
    descripcion: '',
    precio: 0,
    categoria: 'producto',
  };

  constructor(private servicio: GeneralService) {}

  ngOnInit() {
    this.form = new FormGroup({
      imagenes: new FormControl(this.publicacion.imagenes, Validators.required),
      titulo: new FormControl(this.publicacion.titulo, Validators.required),
      descripcion: new FormControl(this.publicacion.descripcion, Validators.required),
      precio: new FormControl(this.publicacion.precio, [Validators.required, Validators.min(0)]),
      categoria: new FormControl(this.publicacion.categoria, Validators.required),
    });
  }

  onImageSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.uploadedImages.push(e.target.result);
        };
        reader.readAsDataURL(files[i]);
        this.files.push(files[i]);
      }
    }
  }

  guardarPublicacion() {
    this.servicio.crearPublicacion(this.publicacion, this.files).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  removeImage(image: string) {
    const index = this.uploadedImages.indexOf(image);
    this.uploadedImages.splice(index, 1);
    this.files.splice(index, 1);
  }
}
