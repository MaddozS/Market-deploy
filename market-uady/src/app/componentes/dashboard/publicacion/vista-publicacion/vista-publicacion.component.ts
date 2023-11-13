import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { GeneralService } from 'src/app/servicios/general.service';
import { PublicationGet, Vendedor } from 'src/app/types';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

type SimplePublication = Omit<PublicationGet, 'imagenes'> & {
  image: string;
  idPublicacion: number;
};

@Component({
  selector: 'app-vista-publicacion',
  templateUrl: './vista-publicacion.component.html',
  styleUrls: ['./vista-publicacion.component.css'],
})
export class VistaPublicacionComponent {
  publicacion: PublicationGet = {
    idPublicacion: 0,
    titulo: '',
    descripcion: '',
    precio: 0,
    categoria: 'producto',
    imagenes: [],
  };

  otherPublicaciones: SimplePublication[] = [];

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

  constructor(
    private servicio: GeneralService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}

  getPublicacionesDelVendedor(vendedorMatricula: string) {
    // Your code to get publications of the seller
    this.servicio.obtenerPublicacionesDelVendedor(vendedorMatricula).subscribe({
      next: (response) => {
        console.log('publicaciones del vendedor:', response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  mostrarMensaje(mensaje: string) {
    this._snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  getPublicacion(id: number) {
    this.servicio.obtenerPublicacion(id).subscribe({
      next: (response) => {
        const { publicacion, vendedor } = response;
        this.publicacion = publicacion;
        this.vendedor = vendedor;
        this.currentImage = publicacion.imagenes[0];
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          const id = params.get('id');
          if (id) {
            return this.servicio.obtenerPublicacion(Number(id));
          }
          return of(null); // Return an observable with null value if id is not present
        }),
        switchMap((response) => {
          if (!response) {
            return of([]);
          }
          const { publicacion, vendedor } = response;
          this.publicacion = publicacion;
          this.vendedor = vendedor;
          this.currentImage = publicacion?.imagenes[0];
          // Fetch other publications of the user
          if (vendedor) {
            return this.servicio.obtenerPublicacionesDelVendedor(vendedor.matricula);
          } else {
            return of([]);
          }
        })
      )
      .subscribe((publications) => {
        const { publicaciones } = publications;
        console.log('publicaciones del vendedor:', publicaciones);
        this.otherPublicaciones = publicaciones.slice(0, 8); // Get only the first 8 publications
      });
  }

  changeCurrentImage(image: string) {
    this.currentImage = image;
  }

  timezone = 'America/Mexico_City';
}
