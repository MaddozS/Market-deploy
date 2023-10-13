import { Component } from '@angular/core';

@Component({
  selector: 'app-vista-publicacion',
  templateUrl: './vista-publicacion.component.html',
  styleUrls: ['./vista-publicacion.component.css'],
})
export class VistaPublicacionComponent {
  images: string[] = [
    '../../../assets/guitar_1.jpg',
    '../../../assets/guitar_2.jpg',
    '../../../assets/guitar_3.jpg',
    '../../../assets/guitar_4.jpg',
  ];

  currentImage: string = this.images[0];

  publicacion = {
    titulo: 'Guitarra',
    descripcion:
      'Esta guitarra es una obra maestra de la artesanía. Con su cuerpo de caoba y su tapa de abeto, produce un sonido cálido y equilibrado que es perfecto para cualquier estilo de música. El diapasón de palisandro es suave al tacto y proporciona una excelente respuesta para los dedos. Los afinadores de alta calidad mantienen la guitarra afinada durante horas de tocar. Esta guitarra es una inversión que durará toda la vida y será una fuente de alegría para cualquier músico.',
    precio: '1000.42',
    fecha: '2021-09-01',
    categoria: 'Producto',
    autor: {
      nombre: 'Juan Carlos',
      apellido: 'Perez Lopez',
      facultad: 'Facultad de Ingeniería',
      numero: '1234567890',
      foto: '../../../assets/juan_perez.jpg',
    },
  };

  otherPublicaciones = [
    {
      name: 'Licuado',
      image: '../../../assets/licuado.jpg',
      price: '50',
    },
    {
      name: 'Salbute',
      image: '../../../assets/salbute.jpeg',
      price: '20',
    },
    {
      name: 'Taco',
      image: '../../../assets/taco.webp',
      price: '10',
    },
    {
      name: 'Galletas',
      image: '../../../assets/galleta.jpg',
      price: '5',
    },
    {
      name: 'Tarea',
      image: '../../../assets/tarea.jpeg',
      price: '100',
    },
    {
      name: 'Torta',
      image: '../../../assets/torta.jpg',
      price: '30',
    },
  ];

  changeCurrentImage(image: string) {
    this.currentImage = image;
  }

  timezone = 'America/Mexico_City';
}
