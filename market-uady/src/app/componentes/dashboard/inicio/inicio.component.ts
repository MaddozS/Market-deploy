import { Component } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { GeneralService } from 'src/app/servicios/general.service';

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {

  campus: any = [];
  facultades: any = [];
  publicaciones: any = [];
  busqueda:any='';
  spinner:any=true;
  body:any = {};

  constructor(private servicio: GeneralService) { }

  ngOnInit() {
    this.servicio.obtenerDatosFiltro().subscribe(
      (response) => {

        this.campus = response.campus;
        this.facultades = response.facultades;
        for (let index = 0; index < this.campus.length; index++) {
          this.campus[index].seleccionado = false;
        }

        for (let index = 0; index < this.facultades.length; index++) {
          this.facultades[index].seleccionado = false;
        }
       
      },
      (error) => {
        console.log(error);
      }

    )
    this.servicio.obtenerPublicacionesInicio().subscribe(
      (response)=>{
       
        this.publicaciones= response.publicaciones;
        const facultadSeleccionada: any = this.facultades.find((facultad: { idFacultad: any; }) => facultad.idFacultad === response.idFacultadUsuario);
        facultadSeleccionada.seleccionado = true;
        this.actualizarValoresCampus(facultadSeleccionada.idCampus, true);
     
      },
      (error) =>{
        console.log(error);
      }
    );
  }

  actualizarValoresFacultades(item: any, bandera: boolean) {
    const objetosFiltrados: any[] = this.facultades.filter((facultad: any) => {
      return facultad.idCampus === item.idCampus && (facultad.seleccionado = bandera);
    });
    this.filtrarPublicaciones();
  }

  actualizarValoresCampus(idCampus: any, bandera: boolean) {
   
    const campusSeleccionado: any = this.campus.find((campus: { idCampus: any; }) => campus.idCampus === idCampus);
    if (bandera == false) {
      campusSeleccionado.seleccionado = false;
    } else {
      const facultadesFiltradas: any[] = this.facultades.filter((facultad: { idCampus: any; }) => facultad.idCampus === idCampus);
      const tienenMismoSeleccionado: boolean = facultadesFiltradas.every(facultad => facultad.seleccionado === true);
      if (tienenMismoSeleccionado) {
        campusSeleccionado.seleccionado = true;
      }
    }
    this.filtrarPublicaciones();
  
  }

  filtrarPublicaciones() {

    this.spinner=true;
    const facultadesFiltradas: any[] = this.facultades.filter((facultad: any) => facultad.seleccionado === true);
    const idFacultadesFiltradas: number[] = facultadesFiltradas.map((facultad: any) => facultad.idFacultad);
    this.body = {};
  if(this.busqueda.length!=0){
    this.body.busqueda = this.busqueda;
  }
    this.body.filtros=idFacultadesFiltradas;
    this.servicio.obtenerPublicacionesFiltrado(this.body).subscribe(

      (response) => {
        this.publicaciones = response;
        this.spinner=false;
      },
      (error) => {
        console.log(error);
        this.spinner=false;
      }
    )
    
  }

}
