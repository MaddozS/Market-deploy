import { Component } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
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

  constructor(private servicio: GeneralService) { }

  ngOnInit() {
    this.servicio.obtenerDatosFiltro().subscribe(
      (response) => {

        this.campus = response.campus;
        this.facultades = response.facultades;
        for (let index = 0; index < this.campus.length; index++) {
          this.campus[index].seleccionado = true;
        }

        for (let index = 0; index < this.facultades.length; index++) {
          this.facultades[index].seleccionado = true;
        }
      },
      (error) => {
        console.log(error);
      }

    )
  }

actualizarValoresFacultades(item: any, bandera:boolean){
  const objetosFiltrados: any[] = this.facultades.filter((facultad: any) => {
    return facultad.idCampus === item.idCampus && (facultad.seleccionado = bandera);
  });
}

actualizarValoresCampus(idCampus:any, idFacultad:any){
  
}

}
