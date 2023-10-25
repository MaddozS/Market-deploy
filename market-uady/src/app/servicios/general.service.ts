import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Publicacion } from '../types';
import { ThisReceiver } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  private get token(): string {
    let tokenString = `Bearer ${sessionStorage.getItem('token')}`;
    let tokenWithoutQuotes = tokenString.replace(/^Bearer\s+"(.*?)"$/, 'Bearer $1');

    return tokenWithoutQuotes;
  }

  private getHeaders(contentType = 'application/json'): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': contentType,
      Authorization: this.token,
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

  obtenerPublicacionesFiltrado(body: any): Observable<any> {
    return this.http.post('http://localhost:8000/api/publications/search', body, { headers: this.getHeaders() });
  }

  obtenerPublicacionesInicio(): Observable<any> {
    return this.http.get('http://localhost:8000/api/publications', { headers: this.getHeaders() });
  }

  obtenerFacultades(): Observable<any> {
    return this.http.get('http://localhost:8000/api/facultades', { headers: this.getHeaders() });
  }

  crearPublicacion(publicacion: Publicacion, imagenes: File[]): Observable<any> {
    console.log(publicacion);
    const formData = new FormData();
    formData.append('titulo', publicacion.titulo);
    formData.append('descripcion', publicacion.descripcion);
    // Add 2 decimal places to the price, because the API expects it
    formData.append('precio', publicacion.precio.toFixed(2));
    formData.append('categoria', publicacion.categoria);
    for (let i = 0; i < imagenes.length; i++) {
      formData.append('imagenes[]', imagenes[i], imagenes[i].name);
    }

    return this.http.post(`${this.baseUrl}/publications/create`, formData, {
      // NOTE: We setting the content type to multipart/form-data, because we are sending files
      // and we need to set the boundary to a random string to avoid errors
      headers: new HttpHeaders({
        Authorization: this.token,
      }),
    });
  }
}
