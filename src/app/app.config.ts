//import { ApplicationConfig } from '@angular/core';
//import { provideRouter } from '@angular/router';
//import { routes } from './app.routes';
//import { provideClientHydration } from '@angular/platform-browser';
//import { TokenInterceptor } from './Auth/token.interceptor';
//import { provideHttpClient, withInterceptors } from '@angular/common/http';
//import { AuthService } from './Auth/auth-service.service';

//export const appConfig: ApplicationConfig = {
//  providers: [
//    provideRouter(routes), provideClientHydration(),
//    provideHttpClient(withInterceptors([TokenInterceptor])),
//    AuthService//bu modul globaldedir başka componenten çağrılmammalı zazten global DI dan geelcek
//  ]
//};

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { TokenInterceptor } from './Auth/token.interceptor';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http'; // withFetch'i buradan import edin
import { AuthService } from './Auth/auth-service.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    // withFetch() eklenerek fetch API'si etkinleştiriliyor
    provideHttpClient(withFetch(), withInterceptors([TokenInterceptor])),
    AuthService // Bu servis globaldir, başka komponentten çağrılmamalıdır.
  ]
};
