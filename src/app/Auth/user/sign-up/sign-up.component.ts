import { Component, OnInit } from '@angular/core';// Yolunuzu kontrol edin
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserapiService } from '../../../services/user-api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, HttpClientModule, CommonModule],
  providers: [UserapiService],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']// Burada `styleUrls` olmalı

})
export class SignUpComponent implements OnInit {

  constructor(private userapiService: UserapiService, private http: HttpClient, private fb: FormBuilder) { }
  name: string = '';
  surname: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  phone: string = '';
  profilePictureUrl = ''
  signUpForm: FormGroup | null = null;

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      profilePictureUrl: ['', Validators.required] // Profil resmi için zorunlu alan
    }, {
      validators: this.passwordMatcher // Şifre doğrulama validasyonu ekledik
    });

    console.log(this.signUpForm);
  }


  passwordMatcher(formGroup: FormGroup) {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');

    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ mismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  }



  //onSubmit() {
  //  const post = {
  //    email: this.email,
  //    password: this.password,
  //    name: this.name,
  //    surname: this.surname,
  //    confirmPassword: this.confirmPassword,
  //    phone : this.phone
  //  };

  //  this.userapiService.signupPost(post).subscribe(
  //    response => {
  //      console.log('Kayıt başarılı:', response);
  //      alert(response.message);
  //    },
  //    error => {
  //      console.error('Kayıt hatası:', error);
  //      alert('Kayıt hatası:');
  //    }
  //  );
  //}

  onSubmit() {
    if (this.signUpForm!.invalid) {
      return;
    }

    const post = this.signUpForm!.value;

    this.userapiService.signupPost(post).subscribe(
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
