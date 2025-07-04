import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserapiService } from '../services/user-api.service';
import { jwtDecode } from 'jwt-decode';  // Named import
import { Observable, catchError, tap, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false; // Kullanıcının giriş durumu
  constructor(
    private userapiService: UserapiService,
    private router: Router,
    private http: HttpClient) { }
  //login(post: any):  {

  //  this.userapiService.loginPost(post).subscribe(
  //    response => {
  //      //console.log('Giriş başarılı:', response);
  //      this.isAuthenticated = true;
  //      localStorage.setItem('authToken', response.token); // Örnek token kaydı
  //      this.router.navigate(['/']); // Admin sayfasına yönlendirme

  //    },
  //    error => {
  //      console.error('Giriş hatası:', error);
  //      //return throwError(() => error); // Hata fırlat
  //    }
  //  );
  //}
  login(post: any): Observable<any> {
    return this.userapiService.loginPost(post).pipe(
      tap(response => {
        console.log('Giriş başarılı:', response);
        this.isAuthenticated = true;
        localStorage.setItem('authToken', response.token);
        this.router.navigate(['/']);
      }),
      catchError(error => {
        console.error('Giriş hatası:', error);
        return throwError(() => error); // Hata fırlat
      })
    );
  }

  logout() {
    this.isAuthenticated = false;
    localStorage.removeItem('authToken');
  }

  isLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      return !!token; // Token varsa true döner, yoksa false
    }
    return false;
  }
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null; // veya uygun bir varsayılan değer
  }


  getRoles(): string {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);  // Doğru kullanım
      //console.log("decodedToken");
      //console.log(decodedToken);
      //alert("roles : " + decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || []);
      return decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || [];
    }
    return "";
  }
  isUser(): boolean {
    return this.getRoles() === 'User';
  }

  isAdmin(): boolean {
    return this.getRoles() === 'Admin';
  }

  hasRole(role: string): boolean {
    const roles = this.getRoles();
    //alert(roles);
    return roles.includes(role);
  }
}
