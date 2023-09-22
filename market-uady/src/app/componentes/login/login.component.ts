import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  viewLogin!: boolean;
  ngOnInit(){
    this.viewLogin=true;
  }

  openRegister(){
    this.viewLogin=false;
  }
}
