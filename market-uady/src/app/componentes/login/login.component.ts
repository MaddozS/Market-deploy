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
  formData = new FormData();
  form!: FormGroup;
  login!: FormGroup;
  viewLogin!: boolean;
  usuario: any = {};
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
      correo: new FormControl(this.usuario.correo, Validators.required),
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
  }

  openRegister() {
    this.viewLogin = false;
  }
  guardarUsuario() {

    if (this.usuario.password == this.usuario.passwordConfirmado) {
      this.formData.append('nombres', this.usuario.nombres);
      this.formData.append('apellidos', this.usuario.apellidos);
      this.formData.append('idFacultad', this.usuario.idFacultad);
      this.formData.append('correo', this.usuario.correo);
      this.formData.append('matricula', this.usuario.matricula);
      this.formData.append('numeroContacto', this.usuario.numeroContacto);
      this.formData.append('password', this.usuario.password);


      this.servicio.guardarUsuario(this.formData).subscribe(
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
    const file: File = event.target.files[0];

    this.formData.append('imagenPerfil', file, file.name);


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