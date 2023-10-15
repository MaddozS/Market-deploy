import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  private URL = "http://localhost:8080";
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });

  }

  private getHeaders(): HttpHeaders {

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });
  }

  login(data: any): Observable<any> {
    return this.http.post('http://localhost:8000/api/login', data);
  }

 

  guardarUsuario(usuario: any): Observable<any> {
    return this.http.post('http://localhost:8000/api/register', usuario);
  }

  
	


}