import { CanActivateFn } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../auth-service.service';



@Injectable({
  providedIn: 'root'
})
export /*const authGuard: CanActivateFn = (route, state) => {*/

  class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isLoggedIn()) {
      return true; // Kullanıcı giriş yaptıysa erişime izin ver
    }
    this.router.navigate(['/login']); // Giriş yapılmadıysa login sayfasına yönlendir
    return false;
  }
}
