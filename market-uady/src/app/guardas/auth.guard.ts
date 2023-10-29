import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GeneralService } from '../servicios/general.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private generalService: GeneralService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.generalService.isLoggedIn()) {
      console.log('es true');
      return true;
    } else {
      this.router.navigate(['/login']); // Redirigir al usuario a la página de inicio de sesión
      return false; // Bloquear el acceso a la ruta
    }
  }
}
