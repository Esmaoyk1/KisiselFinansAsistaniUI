import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserapiService } from '../../services/user-api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
  personForm: FormGroup;

  constructor(private fb: FormBuilder, private userApiService: UserapiService) {
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

  //passwordMatchValidator(form: FormGroup) {
  //  return form.get('password')?.value === form.get('confirmPassword')?.value
  //    ? null : { mismatchedPasswords: true };
  //}


  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password && password.length > 0) {
      return password === confirmPassword ? null : { mismatchedPasswords: true };
    }
    return null;
  }

  onSubmit() {
    if (this.personForm.valid) {
      const userDetails = {
        name: this.personForm.value.name,
        surname: this.personForm.value.surname,
        email: this.personForm.value.email,
        phoneNumber: this.personForm.value.phone,
        profilePictureUrl: this.personForm.value.profilePicture
      };

      this.userApiService.updateUserDetail(userDetails).subscribe(
        response => {
          console.log('✅ Kullanıcı bilgileri başarıyla güncellendi!', response);
        },
        error => {
          console.error('❌ Kullanıcı bilgileri güncellenirken hata oluştu:', error);
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




