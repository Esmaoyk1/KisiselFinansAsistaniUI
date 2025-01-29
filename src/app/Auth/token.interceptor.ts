import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth-service.service';
import { Router } from '@angular/router';

// Interceptor fonksiyonunu tanımlıyoruz
//export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
export const TokenInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  //alert("Interceptor çalıştı");

  const router = inject(Router); 
  const authService = inject(AuthService);
  const token = authService.getToken();
  //alert("Interceptor çalıştı" + token);
  if (token) {
    //alert("token : " + token);
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

  }
  else {
    alert("token intercepterda alınamadı");
  }

  //return next(req);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.warn("Yetkisiz erişim! Kullanıcı oturumu kapatılıyor...");
        authService.logout(); // Kullanıcı oturumunu kapat
        router.navigate(['/login']); // Giriş sayfasına yönlendir
      }
      return throwError(() => error);
    })
  );
};
