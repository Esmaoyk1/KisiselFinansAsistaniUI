import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false; // Kullanıcının giriş durumu

  login() {
    this.isAuthenticated = true;
    localStorage.setItem('authToken', 'sample-token'); // Örnek token kaydı
  }

  logout() {
    this.isAuthenticated = false;
    localStorage.removeItem('authToken');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token; // Token varsa true döner, yoksa false
  }
}
