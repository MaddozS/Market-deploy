import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { LoginComponent } from './componentes/login/login.component';
import { HeaderComponent } from './componentes/header/header.component';

@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule,FormsModule, ReactiveFormsModule, HttpClientModule, MatSnackBarModule],
  exports:[],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
