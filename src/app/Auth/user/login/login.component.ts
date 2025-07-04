import { Component } from '@angular/core';

import { Observable } from 'rxjs'; // Observable kullanacağız
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../auth-service.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule, FormsModule, HttpClientModule],
  providers: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  emaill: string = '';   //qwgg
  passwordd: string = ''; //1231165

  constructor(
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
    //this.authService.login(post);
    this.authService.login(post).subscribe({
      next: (response) => {
        alert("Login successful: "/* + JSON.stringify(response)*/);
      },
      error: (err) => {
        alert("Login failed: " + err.error?.message || err.message);
      }
    });

  }
}
