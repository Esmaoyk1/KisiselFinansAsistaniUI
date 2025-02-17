import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserapiService } from '../../services/user-api.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
  personForm: FormGroup;
  selectedFile!: File;
  previewUrl: string | ArrayBuffer | null = null;
  constructor(private fb: FormBuilder, private userApiService: UserapiService, private router: Router) {
    this.personForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      confirmPassword: [''],
      phone: ['', Validators.required],
      profilePicture: [null],
    },

      { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password && password.length > 0) {
      return password === confirmPassword ? null : { mismatchedPasswords: true };
    }
    return null;
  }

  onFileSelected(event: any) {//resim seçerken bu fonksiyon çalışıyor
    alert("onFileSelected");
    const file = event.target.files[0];

    if (file) {
      this.selectedFile = file;

      // Resmi önizleme için FileReader kullanıyoruz
      const reader = new FileReader();
      reader.onload = (e) => (this.previewUrl = reader.result);
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.personForm.valid) {
      const userDetails = new FormData();
      userDetails.append('name', this.personForm!.get('name')?.value);
      userDetails.append('surname', this.personForm!.get('surname')?.value);
      userDetails.append('email', this.personForm!.get('email')?.value);
      userDetails.append('phoneNumber', this.personForm!.get('phone')?.value);
      userDetails.append('profilePicture', this.selectedFile); // Resmi ekl


      this.userApiService.updateUserDetail(userDetails).subscribe(
        response => {
          this.getUserDetail();
          alert(response.message);
          this.router.navigate(['/userProfile']); // İptal edildiğinde yönlendirme

        },
        error => {
          console.log(error.error);
        }
      );
    } else {
      console.log('🚨 Form geçersiz! Hatalar:', this.personForm.errors);
      console.log('Form Kontrolleri:', this.personForm.controls);
      Object.keys(this.personForm.controls).forEach(field => {
        const control = this.personForm.get(field);
        if (control?.invalid) {
          console.log(`Hata: ${field} ->`, control.errors);
        }
      });
    }
  }
  ngOnInit() {
    this.getUserDetail();
  }

  getUserDetail() {
    this.userApiService.getUserDetail().subscribe(data => {
      console.log("data");
      console.log(data);
      this.personForm.patchValue({
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phoneNumber,
        profilePicture: 'http://localhost:5177/uploads/' + data.profilePictureUrl
      });
    }, error => {
      console.error('❌ Kullanıcı bilgileri alınırken hata oluştu:', error);
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      console.log(formData);
      this.userApiService.uploadProfilePicture(formData).subscribe(
        (response: any) => {
          this.personForm.patchValue({
            profilePicture: response.profilePictureUrl
          });
        },
        (error) => {
          console.error('❌ Resim yüklenirken hata oluştu:', error);
        }
      );
    }
  }
  }




