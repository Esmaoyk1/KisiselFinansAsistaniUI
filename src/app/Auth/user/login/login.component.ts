import { Component } from '@angular/core';

import { Observable } from 'rxjs'; // Observable kullanacağız
import { KisiselApiService } from '../../../services/kisisel-api.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../auth-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, HttpClientModule],
  providers: [KisiselApiService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  emaill: string = '';   //qwgg
  passwordd: string = ''; //1231165

  constructor(
    private kisiselapiService: KisiselApiService,
    private authService: AuthService,
    private http: HttpClient) { }


  ngOnInit() {
  
  }
  onSubmit() {
    const post = {
      email: this.emaill,
      password: this.passwordd
    };
    //{ email: "qwgg",password :"1231165"}
    //auth service in loginine aatcak
    this.authService.login(post);
   
  }
}
