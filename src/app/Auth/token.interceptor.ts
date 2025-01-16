import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth-service.service';

// Interceptor fonksiyonunu tanımlıyoruz
//export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
export const TokenInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
   //alert("Interceptor çalıştı");
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

  return next(req);
};
