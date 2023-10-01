import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {NgFor} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { PublicacionComponent } from './publicacion/publicacion.component';
import { InicioComponent } from './inicio/inicio.component';


@NgModule({
  declarations: [
    DashboardComponent,
    PublicacionComponent,
    InicioComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ScrollingModule,
    MatCheckboxModule,
    NgFor,
    FormsModule
  ]
})
export class DashboardModule { }
