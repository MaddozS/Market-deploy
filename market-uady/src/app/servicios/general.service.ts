import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Publicacion, PublicacionResponse, PublicacionEdit } from '../types';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  private baseURL = 'http://localhost:8000/api';
  private loggedIn = false;

  constructor(private http: HttpClient) {}

  public get token(): string {
    const tokenString = `Bearer ${sessionStorage.getItem('token')}`;
    const tokenWithoutQuotes = tokenString.replace(/^Bearer\s+"(.*?)"$/, 'Bearer $1');
    return tokenWithoutQuotes;
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseURL}/login`, data).pipe(
      tap(() => {
        // Actualiza el estado de autenticación cuando el usuario inicia sesión exitosamente
        this.loggedIn = true;
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
    return this.http.post(`${this.baseURL}/register`, usuario);
  }

  obtenerDatosFiltro(): Observable<any> {
    return this.http.get(`${this.baseURL}/filters`, { headers: this.getHeaders() });
  }
  obtenerPublicacionesFiltrado(body: any): Observable<any> {
    return this.http.post(`${this.baseURL}/publications/search`, body, { headers: this.getHeaders() });
  }

  obtenerPublicacionesInicio(): Observable<any> {
    return this.http.get(`${this.baseURL}/publications`, { headers: this.getHeaders() });
  }

  obtenerFacultades(): Observable<any> {
    return this.http.get(`${this.baseURL}/facultades`, { headers: this.getHeaders() });
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

    return this.http.post(`${this.baseURL}/publications/create`, formData, {
      // NOTE: We setting the content type to multipart/form-data, because we are sending files
      // and we need to set the boundary to a random string to avoid errors
      headers: new HttpHeaders({
        Authorization: this.token,
      }),
    });
  }

  editarPublicacion(id: number, publicacion: PublicacionEdit, imagenes: File[]): Observable<any> {
    console.log(publicacion);
    const formData = new FormData();
    formData.append('titulo', publicacion.titulo);
    formData.append('descripcion', publicacion.descripcion);
    // Add 2 decimal places to the price, because the API expects it
    if (typeof publicacion.precio === 'string') {
      const precio = parseFloat(publicacion.precio);
      formData.append('precio', precio.toFixed(2));
    } else {
      formData.append('precio', publicacion.precio.toFixed(2));
    }
    formData.append('categoria', publicacion.categoria);
    formData.append('idPublication', id.toString());
    for (let i = 0; i < imagenes.length; i++) {
      formData.append('imagenes[]', imagenes[i], imagenes[i].name);
    }

    return this.http.post(`${this.baseURL}/publications?_method=PUT`, formData, {
      // NOTE: We setting the content type to multipart/form-data, because we are sending files
      // and we need to set the boundary to a random string to avoid errors
      headers: new HttpHeaders({
        Authorization: this.token,
      }),
    });
  }

  obtenerPublicacion(id: number): Observable<PublicacionResponse> {
    return this.http.get<PublicacionResponse>(`${this.baseURL}/publications/${id}`, { headers: this.getHeaders() });
  }
}
