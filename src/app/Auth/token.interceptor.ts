import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth-service.service';

// Interceptor fonksiyonunu tanımlıyoruz
export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  alert("Interceptor çalıştı");
  const authService = inject(AuthService);
  const token = authService.getToken();
  alert("Interceptor çalıştı" + token);
  if (token) {
    console.log("token : " + token);
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer123 ${token}`,
      },
    });

  }

  return next(req);
};
