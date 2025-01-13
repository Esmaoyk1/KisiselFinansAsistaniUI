import { Injectable } from '@angular/core';
import { KisiselApiService } from '../services/kisisel-api.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false; // Kullanıcının giriş durumu
  constructor(
    private kisiselapiService: KisiselApiService,
    private router: Router,
    private http: HttpClient) { }
  login(post: any) {

    this.kisiselapiService.createPost(post).subscribe(
      response => {
        console.log('Giriş başarılı:', response);
        this.isAuthenticated = true;
        localStorage.setItem('authToken', response.token); // Örnek token kaydı
        this.router.navigate(['/']); // Admin sayfasına yönlendirme

      },
      error => {
        console.error('Giriş hatası:', error);
        //alert('Giriş hatası:');
      }
    );


   
  }

  logout() {
    this.isAuthenticated = false;
    localStorage.removeItem('authToken');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token; // Token varsa true döner, yoksa false
  }
  getToken(): string | null {
    return localStorage.getItem('authToken'); // Token alınır
  }
}
