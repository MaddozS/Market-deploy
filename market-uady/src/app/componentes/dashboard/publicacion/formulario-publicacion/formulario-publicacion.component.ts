import { Component } from '@angular/core';

@Component({
  selector: 'app-formulario-publicacion',
  templateUrl: './formulario-publicacion.component.html',
  styleUrls: ['./formulario-publicacion.component.css'],
})
export class FormularioPublicacionComponent {
  uploadedImages: string[] = [];

  onImageSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.uploadedImages.push(e.target.result);
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  uploadImages() {
    // You can implement image upload logic here, e.g., using a service.
    // Clear the file input after uploading
    this.uploadedImages = [];
  }
}
