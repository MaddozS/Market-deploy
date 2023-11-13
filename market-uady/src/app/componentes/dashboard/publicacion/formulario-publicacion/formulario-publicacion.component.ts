import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/servicios/general.service';
import { Publicacion, PublicacionEdit, PublicacionResponse } from 'src/app/types';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MAX_FILE_SIZE, MAX_IMAGES_PER_PUBLICATION } from 'src/app/constants/const';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-formulario-publicacion',
  templateUrl: './formulario-publicacion.component.html',
  styleUrls: ['./formulario-publicacion.component.css'],
})
export class FormularioPublicacionComponent {
  form!: FormGroup;
  uploadedImages: string[] = [];
  files: File[] = [];
  imagesCount = 0; // max limit of images is 5
  isEditing = false;
  currentId: number | null = null;
  imagesCountShouldReset = false;

  titulo = 'Publicar nuevo producto o servicio';
  publicacion: PublicacionEdit = {
    imagenes: [],
    titulo: '',
    descripcion: '',
    precio: 0,
    categoria: 'producto',
  };

  constructor(
    private servicio: GeneralService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}

  mostrarMensaje(mensaje: string, action?: string) {
    this._snackBar.open(mensaje, action || 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  getPublicacion(id: number) {
    this.servicio.obtenerPublicacion(id).subscribe({
      next: (response) => {
        const { publicacion } = response;
        this.publicacion = { ...this.publicacion, ...publicacion, imagenes: null };
        // Get images url from the publicacion and transform them into an File array
        // to be able to show them in the form
        // this.files = files;
        this.uploadedImages = publicacion.imagenes;
        this.isEditing = true;
        this.imagesCountShouldReset = true;
        this.currentId = id;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  ngOnInit() {
    this.form = new FormGroup({
      titulo: new FormControl(this.publicacion.titulo, [Validators.required]),
      descripcion: new FormControl(this.publicacion.descripcion, [Validators.required]),
      precio: new FormControl(this.publicacion.precio, [Validators.required, Validators.min(0.01)]),
      /*  categoria: new FormControl(this.publicacion.categoria, [Validators.required]), */
      imagenes: new FormControl(this.publicacion.imagenes),
    });

    // Getting the id from the URL
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          const id = params.get('id');
          if (id) {
            return this.servicio.obtenerPublicacion(parseInt(id));
          }
          return of(null);
        }),
        switchMap((response: any) => {
          if (response) {
            const { publicacion } = response as PublicacionResponse;
            this.publicacion = { ...this.publicacion, ...publicacion, imagenes: null };
            // Get images url from the publicacion and transform them into an File array
            // to be able to show them in the form
            // this.files = files;
            this.uploadedImages = publicacion.imagenes;
            this.isEditing = true;
            this.imagesCountShouldReset = true;
            this.currentId = publicacion.idPublicacion;
          } else {
            this.form.removeControl('imagenes');
            this.form.addControl('imagenes', new FormControl(this.publicacion.imagenes, [Validators.required]));
          }
          return of(null);
        })
      )
      .subscribe();
  }

  onImageSelected(event: any) {
    const filesUploaded: File[] = event.target.files;
    if (!filesUploaded) {
      return;
    }

    // If the user is editing a publication, we remove the old images from the array
    // and add the new ones
    if (this.isEditing && this.imagesCountShouldReset) {
      this.uploadedImages = [];
      this.files = [];
      this.imagesCount = 0;
      this.imagesCountShouldReset = false;
    }

    // Check if the images does not exceed the limit of images
    if (this.imagesCount + filesUploaded.length > MAX_IMAGES_PER_PUBLICATION) {
      this.mostrarMensaje(`El límite de imágenes por publicación es de ${MAX_IMAGES_PER_PUBLICATION}`);
      return;
    }

    for (const file of filesUploaded) {
      if (file.size > MAX_FILE_SIZE) {
        this.mostrarMensaje('El tamaño máximo de las imágenes es de 4MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedImages.push(e.target.result);
      };
      reader.readAsDataURL(file);
      this.files.push(file);
      this.imagesCount++;
    }
  }

  guardarPublicacion() {
    this.servicio.crearPublicacion(this.publicacion as Publicacion, this.files).subscribe({
      next: (response) => {
        this.mostrarMensaje('Publicación creada!');
        this.form.reset();
        this.uploadedImages = [];
        this.files = [];
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  guardarCambios() {
    if (!this.currentId) {
      return;
    }

    this.servicio.editarPublicacion(this.currentId, this.publicacion as PublicacionEdit, this.files).subscribe({
      next: (response) => {
        console.log(response);
        this.mostrarMensaje('Publicación editada!');
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
