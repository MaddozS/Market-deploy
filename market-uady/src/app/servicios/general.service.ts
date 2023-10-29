import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export class TuModulo { }

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

    let tokenString = `Bearer ${sessionStorage.getItem('token')}`;
    let tokenWithoutQuotes = tokenString.replace(/^Bearer\s+"(.*?)"$/, 'Bearer $1');
    
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': tokenWithoutQuotes
    });
  }

  login(data: any): Observable<any> {
    return this.http.post('http://localhost:8000/api/login', data);
  }

  guardarUsuario(usuario: any): Observable<any> {
    return this.http.post('http://localhost:8000/api/register', usuario);
  }

  obtenerDatosFiltro(): Observable<any> {
    return this.http.get('http://localhost:8000/api/filters', { headers: this.getHeaders() });
  }
   obtenerPublicacionesFiltrado(body:any): Observable<any> {

    return this.http.post('http://localhost:8000/api/publications/search',  body, { headers: this.getHeaders() });
  }

  obtenerPublicacionesInicio(): Observable<any>{
    return this.http.get('http://localhost:8000/api/publications', { headers: this.getHeaders() });
  }

  obtenerFacultades():Observable<any>{
    return this.http.get('http://localhost:8000/api/facultades', { headers: this.getHeaders() });
  }

  obtenerDatosUsuario(): Observable<any> {
    return this.http.get('http://localhost:8000/api/users', { headers: this.getHeaders() });
  }

  actualizarDatosPerfil(usuario: any): Observable<any> {
    return this.http.post('http://localhost:8000/api/profile/update?_method=PUT', usuario);
  }

}