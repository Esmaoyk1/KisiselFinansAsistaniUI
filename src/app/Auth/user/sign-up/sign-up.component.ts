import { Component, OnInit } from '@angular/core';// Yolunuzu kontrol edin
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SignUpService } from '../../../services/sign-up.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, HttpClientModule],
  providers: [SignUpService],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']// Burada `styleUrls` olmalı

})
export class SignUpComponent implements OnInit {
  emaill: string = '';
  passwordd: string = '';

  constructor(private kisiselapiService: SignUpService, private http: HttpClient) { }

  ngOnInit() {
    // Gerekli başlangıç işlemleri
  }

  onSubmit() {
    const post = {
      email: this.emaill,
      password: this.passwordd
    };

    this.kisiselapiService.createPost(post).subscribe(
      response => {
        console.log('Kayıt başarılı:', response);
        alert(response.message);
      },
      error => {
        console.error('Kayıt hatası:', error);
        alert('Kayıt hatası:');
      }
    );
  }
}
