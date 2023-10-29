import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  private URL = 'http://localhost:8080';
  private headers: HttpHeaders;
  private loggedIn = false;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    });
  }

  private getHeaders(): HttpHeaders {
    const tokenString = `Bearer ${sessionStorage.getItem('token')}`;
    const tokenWithoutQuotes = tokenString.replace(/^Bearer\s+"(.*?)"$/, 'Bearer $1');

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: tokenWithoutQuotes,
    });
  }

  login(data: any): Observable<any> {
    return this.http.post('http://localhost:8000/api/login', data).pipe(
      tap(() => {
        // Actualiza el estado de autenticación cuando el usuario inicia sesión exitosamente
        this.loggedIn=true;
        sessionStorage.setItem('isLoggedIn', 'true');

      })
    );
  }
  isLoggedIn(): boolean {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
  this.loggedIn = isLoggedIn === 'true';
  console.log(this.loggedIn);
  return this.loggedIn;
  }
  guardarUsuario(usuario: any): Observable<any> {
    return this.http.post('http://localhost:8000/api/register', usuario);
  }

  obtenerDatosFiltro(): Observable<any> {
    return this.http.get('http://localhost:8000/api/filters', { headers: this.getHeaders() });
  }
  obtenerPublicacionesFiltrado(body: any): Observable<any> {
    return this.http.post('http://localhost:8000/api/publications/search', body, { headers: this.getHeaders() });
  }

  obtenerPublicacionesInicio(): Observable<any> {
    return this.http.get('http://localhost:8000/api/publications', { headers: this.getHeaders() });
  }

  obtenerFacultades(): Observable<any> {
    return this.http.get('http://localhost:8000/api/facultades', { headers: this.getHeaders() });
  }
}
