import { Route } from '@angular/router';
import { AppComponent } from './app.component';  // Örnek bileşen
import { LoginComponent } from './Auth/user/login/login.component';
import { HomeComponent } from './home/home.component';
import { Comp1Component } from './comp1/comp1.component';
import { SignUpComponent } from './Auth/user/sign-up/sign-up.component';

export const routes: Route[] = [
  { path: '', component: HomeComponent }, // Ana sayfa
  { path: 'login', component: LoginComponent },
  { path: 'signUp', component: SignUpComponent },


  { path: '**', redirectTo: '', pathMatch: 'full' },    // Geçersiz yollar için ana sayfaya yönlendirme

];
