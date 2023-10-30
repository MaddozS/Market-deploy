import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicacionComponent } from './publicacion.component';
import { VistaPublicacionComponent } from './vista-publicacion/vista-publicacion.component';
import { FormularioPublicacionComponent } from './formulario-publicacion/formulario-publicacion.component';

const routes: Routes = [
  {
    path: '',
    component: PublicacionComponent,
    children: [
      { path: 'vista-publicacion', children: [{ path: ':id', component: VistaPublicacionComponent }] },
      {
        path: 'formulario-publicacion',
        children: [
          { path: '', component: FormularioPublicacionComponent },
          { path: 'edit/:id', component: FormularioPublicacionComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicacionRoutingModule {}
