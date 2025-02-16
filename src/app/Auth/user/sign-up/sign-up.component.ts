import { Component, OnInit } from '@angular/core';// Yolunuzu kontrol edin
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserapiService } from '../../../services/user-api.service';
import { CommonModule } from '@angular/common';
import {  Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, FormsModule, HttpClientModule, CommonModule],
  providers: [UserapiService],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']// Burada `styleUrls` olmalı

})
export class SignUpComponent implements OnInit {

  constructor(private userapiService: UserapiService,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,) { }
  selectedFile!: File;
  //previewUrl: string | ArrayBuffer | null = null;

  name: string = '';
  surname: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  phone: string = '';
  previewUrl: string | ArrayBuffer | null = null;
  signUpForm: FormGroup | null = null;

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      previewUrl: ['']

    }, {
      validators: this.passwordMatcher // Şifre doğrulama validasyonu ekledik
    });

    console.log(this.signUpForm);
  }


  onFileSelected(event: any) {//resim seçerken bu fonksiyon çalışıyor
    const file = event.target.files[0];

    if (file) {
      this.selectedFile = file;

      // Resmi önizleme için FileReader kullanıyoruz
      const reader = new FileReader();
      reader.onload = (e) => (this.previewUrl = reader.result);
      reader.readAsDataURL(file);
    }
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
    if (!this.selectedFile) {
      alert("Lütfen bir dosya seçin!");
      return;
    }
    const formData = new FormData();
    formData.append('name', this.signUpForm!.get('name')?.value);
    formData.append('surname', this.signUpForm!.get('surname')?.value);
    formData.append('email', this.signUpForm!.get('email')?.value);
    formData.append('password', this.signUpForm!.get('password')?.value);
    formData.append('confirmPassword', this.signUpForm!.get('confirmPassword')?.value);
    formData.append('phone', this.signUpForm!.get('phone')?.value);
    formData.append('profilePicture', this.selectedFile); // Resmi ekl


    //const post = this.signUpForm!.value;
    //post.previewUrl = this.selectedFile;
    console.log(formData.getAll);

    this.userapiService.signupPost(formData).subscribe(
      response => {
        console.log('Kayıt başarılı:', response);
        this.router.navigate(['login'] );
        alert(response.message);
      },
      error => {
        console.error('Kayıt hatası:', error);
        alert('Kayıt hatası:');
      }
    );
  }
}
