import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicacionRoutingModule } from './publicacion-routing.module';
import { FormularioPublicacionComponent } from './formulario-publicacion/formulario-publicacion.component';
import { VistaPublicacionComponent } from './vista-publicacion/vista-publicacion.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [FormularioPublicacionComponent, VistaPublicacionComponent],
  imports: [
    CommonModule,
    PublicacionRoutingModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
  ],
})
export class PublicacionModule {}
