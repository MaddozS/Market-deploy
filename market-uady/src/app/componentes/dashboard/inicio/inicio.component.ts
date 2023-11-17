import { Component } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/servicios/general.service';
import { switchMap } from 'rxjs/operators';

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent {
  campus: any = [];
  facultades: any = [];
  publicaciones: any = [];
  busqueda: any = '';
  spinner: any = true;
  body: any = {};

  constructor(private servicio: GeneralService) {}

  ngOnInit() {
    this.servicio
      .obtenerDatosFiltro()
      .pipe(
        switchMap((response) => {
          this.campus = response.campus.map((campus: any) => {
            return { ...campus, seleccionado: false };
          });
          this.facultades = response.facultades.map((facultad: any) => {
            return { ...facultad, seleccionado: false };
          });

          // Switch to the obtenerPublicacionesInicio Observable
          return this.servicio.obtenerPublicacionesInicio();
        })
      )
      .subscribe(
        (response) => {
          this.publicaciones = response.publicaciones;
          const facultadSeleccionada: any = this.facultades.find(
            (facultad: { idFacultad: any }) => facultad.idFacultad === response.idFacultadUsuario
          );
          this.facultades = this.facultades.map((facultad: any) => {
            if (facultad.idFacultad === response.idFacultadUsuario) {
              return { ...facultad, seleccionado: true };
            }
            return facultad;
          });
          this.actualizarValoresCampus(facultadSeleccionada.idCampus);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  actualizarValoresFacultades(campus: any, bandera: boolean) {
    const facultadesSeleccionadas: any[] = this.facultades.filter((facultad: { idCampus: any }) => facultad.idCampus === campus.idCampus);
    console.log('facultadesSeleccionadas', facultadesSeleccionadas);
    facultadesSeleccionadas.forEach((facultad: any) => {
      facultad.seleccionado = bandera;
    });
    this.filtrarPublicaciones();
  }

  actualizarValoresCampus(idCampus: any) {
    // Verificar si todas las facultades del campus están seleccionadas, si es así, seleccionar el campus
    const facultadesSeleccionadas: any[] = this.facultades.filter((facultad: { idCampus: any }) => facultad.idCampus === idCampus);
    const facultadesSeleccionadasBoolean: boolean[] = facultadesSeleccionadas.map((facultad: any) => facultad.seleccionado);
    const todasLasFacultadesSeleccionadas: boolean = facultadesSeleccionadasBoolean.every((seleccionado: boolean) => seleccionado);

    // Si todas las facultades del campus están seleccionadas, seleccionar el campus
    const campusSeleccionado: any = this.campus.find((campus: { idCampus: any }) => campus.idCampus === idCampus);
    campusSeleccionado.seleccionado = todasLasFacultadesSeleccionadas;

    this.filtrarPublicaciones();
  }

  filtrarPublicaciones() {
    this.spinner = true;
    const facultadesFiltradas: any[] = this.facultades.filter((facultad: any) => facultad.seleccionado === true);
    const idFacultadesFiltradas: number[] = facultadesFiltradas.map((facultad: any) => facultad.idFacultad);
    this.body = {};
    if (this.busqueda.length != 0) {
      this.body.busqueda = this.busqueda;
    }
    this.body.filtros = idFacultadesFiltradas;
    this.servicio.obtenerPublicacionesFiltrado(this.body).subscribe(
      (response) => {
        this.publicaciones = response;
        this.spinner = false;
      },
      (error) => {
        console.log(error);
        this.spinner = false;
      }
    );
  }
}
