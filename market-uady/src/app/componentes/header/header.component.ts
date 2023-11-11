import { Component } from '@angular/core';
import { GeneralService } from 'src/app/servicios/general.service';

import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']

})
export class HeaderComponent {
  nombreDeLaPersona: string = 'Nombre de la Persona'; // Reemplaza con el nombre real
  idVendedor: any;
  perfil: any;
  isMenuVisible: boolean = false;
 

  toggleMenu(event: Event) {
    event.stopPropagation(); // Detener la propagación del evento para que no cierre el menú
    this.isMenuVisible = !this.isMenuVisible;
  }

  hideMenu() {
    this.isMenuVisible = false;
  }

  redirectToProfileEdit() {
    this.router.navigate(['/editar-perfil']); // Redirige a la página de edición de perfil
  }

  redirectToLogout() {
    // Realiza aquí las acciones necesarias antes de cerrar la sesión
    // Luego redirige a la página de inicio de sesión
    sessionStorage.removeItem('matricula');
    sessionStorage.removeItem('idUsuario');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('token_type');

    this.router.navigate(['/login']); // Ajusta la ruta según tu página de inicio de sesión

  }





  constructor(
    private servicio: GeneralService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}





  ngOnInit() {

    const matriculaString = sessionStorage.getItem('matricula');
      if (matriculaString != null) {
        const cleanedMatriculaString = matriculaString.replace(/[^0-9]/g, ''); // Eliminar caracteres no numéricos
        const matricula: number = parseInt(cleanedMatriculaString, 10);
        this.idVendedor = matricula;
      
       this.obtenerPublicacionesVendedor(this.idVendedor);
       
      }

  }


  obtenerPublicacionesVendedor(id:any){

    this.servicio.obtenerPublicacionesDelVendedor(id).subscribe((response) => {
      
      this.perfil = response.vendedor;
      console.log(response);
    });

  }

  

  






}



