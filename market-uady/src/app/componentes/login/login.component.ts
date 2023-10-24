import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/servicios/general.service';
import { StorageService } from 'src/app/servicios/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  form!: FormGroup;
  login!: FormGroup;
  viewLogin!: boolean;
  facultades: any = [];
  usuario: any = {};
  file!: File;
  constructor(private servicio: GeneralService,
    private router: Router,
    private storage: StorageService,
    private _snackBar: MatSnackBar,) {

  }
  ngOnInit() {
    this.viewLogin = true;
    this.form = new FormGroup({
      nombres: new FormControl(this.usuario.nombres, Validators.required),
      apellidos: new FormControl(this.usuario.apellidos, Validators.required),
      correo: new FormControl(this.usuario.correo,[ Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@alumnos.uady\.mx$/)]),
      idFacultad: new FormControl(this.usuario.idFacultad, Validators.required),
      numeroContacto: new FormControl(this.usuario.numeroContacto, Validators.required),
      password: new FormControl(this.usuario.password, Validators.required),
      passwordConfirmado: new FormControl(this.usuario.passwordConfirmado, Validators.required),
      matricula: new FormControl(this.usuario.matricula, Validators.required),
      imagenPerfil: new FormControl(this.usuario.imagenPerfil, Validators.required)
    });
    this.login = new FormGroup({
      correo: new FormControl(this.usuario.correo, Validators.required),
      password: new FormControl(this.usuario.password, Validators.required)
    });


    this.servicio.obtenerFacultades().subscribe(
(response)=>{
this.facultades = response;
},
(error)=>{

}
    );
  }

  openRegister() {
    this.viewLogin = false;
  }
  guardarUsuario() {
    const formData = new FormData();
    if (this.usuario.password == this.usuario.passwordConfirmado) {
      formData.append('nombres', this.usuario.nombres);
      formData.append('apellidos', this.usuario.apellidos);
      formData.append('idFacultad', this.usuario.idFacultad);
      formData.append('correo', this.usuario.correo);
      formData.append('matricula', this.usuario.matricula);
      formData.append('numeroContacto', this.usuario.numeroContacto);
      formData.append('password', this.usuario.password);
      formData.append('imagenPerfil', this.file, this.file.name);

      this.servicio.guardarUsuario(formData).subscribe(
        (response) => {
          this.mostrarAlerta("Usuario creado");
          this.crearItemsSessionStorage(response);
          this.router.navigate(['dashboard/inicio']);
        },
        (error) => {
          this.mostrarAlerta("Error al crear el usuario");
        }
      )
    } else {
      this.mostrarAlerta("Las contraseñas no son iguales");
    }

  }


  onFileSelected(event: any) {
  this.file= event.target.files[0];

  }

  mostrarAlerta(mensaje: any) {
    this._snackBar.open(mensaje, '', {
      duration: 1000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  cancelar() {
    this.viewLogin = true;
  }
  ingresar() {

    this.servicio.login(this.usuario).subscribe(

       (response) => {
        this.mostrarAlerta("Sesión iniciada")

        this.crearItemsSessionStorage(response);
       
        this.router.navigate(['dashboard/inicio']);
      },
      (error) => {
        this.mostrarAlerta("Usuario y/o contraseña incorrectos")
      }
    );

  }

  crearItemsSessionStorage(response: any){
    this.storage.setItem('token', response.token);
    this.storage.setItem('token_type', response.token_type);
  }
  
}