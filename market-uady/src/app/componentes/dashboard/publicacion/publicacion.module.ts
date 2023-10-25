import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PublicacionRoutingModule } from './publicacion-routing.module';
import { FormularioPublicacionComponent } from './formulario-publicacion/formulario-publicacion.component';
import { VistaPublicacionComponent } from './vista-publicacion/vista-publicacion.component';

@NgModule({
  declarations: [FormularioPublicacionComponent, VistaPublicacionComponent],
  imports: [CommonModule, PublicacionRoutingModule, ReactiveFormsModule, FormsModule],
})
export class PublicacionModule {}
