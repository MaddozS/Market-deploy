import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioComponent } from './usuario.component';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { FormularioUsuarioComponent } from './formulario-usuario/formulario-usuario.component';

const routes: Routes = [
  {
    path: '', component: UsuarioComponent, children: [
      { path: 'perfil-usuario', component:PerfilUsuarioComponent },
      { path: 'formulario-usuario', component:FormularioUsuarioComponent},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
