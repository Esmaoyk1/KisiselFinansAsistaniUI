import { Component } from '@angular/core';

import { Observable } from 'rxjs'; // Observable kullanacağız
import { KisiselApiService } from '../../../services/kisisel-api.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, HttpClientModule],
  providers: [KisiselApiService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  emaill: string = ''; 
  passwordd: string = ''; 

  constructor(private kisiselapiService: KisiselApiService, private http: HttpClient) { }


  ngOnInit() {
  
  }
  onSubmit() {
    alert(this.emaill);
    alert(this.passwordd);
    const post = {
      email: this.emaill,
      password: this.passwordd
    };

    alert(post);
    //const post = {
    //  email: "ada@gmail.com",
    //  password: "Esma.38"
    //};


    this.kisiselapiService.createPost(post).subscribe(
      response => {
        console.log('Giriş başarılı:', response);
        alert('Giriş başarılı:');

      },
      error => {
        console.error('Giriş hatası:', error);
        alert('Giriş hatası:');
      }
    );
  }
}
