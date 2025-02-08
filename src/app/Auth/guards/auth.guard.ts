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
    state: RouterStateSnapshot): boolean {

    if (!this.authService.isLoggedIn()) {
     
      this.router.navigate(['/login']); // Giriş yapılmadıysa login sayfasına yönlendir
      return false;
    }

    // Eğer rota bir role gerektiriyorsa ve kullanıcı bu role sahip değilse
    const expectedRole = route.data['role'];
    if (expectedRole && !this.authService.hasRole(expectedRole)) {
      // Yetkisiz erişim için anasayfaya yönlendir
      alert("Bu sayfaya erişim yetkiniz yoktur");
      this.router.navigate(['/unauthorized']);
      return false;
    }
    return true;
  }

}
