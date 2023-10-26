import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {NgFor} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PublicacionComponent } from './publicacion/publicacion.component';
import { InicioComponent } from './inicio/inicio.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { HeaderComponent } from '../header/header.component';

@NgModule({
  declarations: [
    DashboardComponent,
    PublicacionComponent,
    InicioComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ScrollingModule,
    MatCheckboxModule,
    NgFor,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    
  ]
})
export class DashboardModule { }
