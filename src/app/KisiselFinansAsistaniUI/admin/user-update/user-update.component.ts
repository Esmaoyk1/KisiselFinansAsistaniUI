import { Component } from '@angular/core';
import { FormBuilder, FormGroup,  ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserapiService } from '../../../services/user-api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-update',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule],
  templateUrl: './user-update.component.html',
  styleUrl: './user-update.component.css'
})
export class UserUpdateComponent {
  updateUser: any;
  userForm: FormGroup;
  profilePictureUrl: string = ''; // Başlangıç değeri atayın
  selectedFile: File | null = null; // Seçilen dosya

  userId!: number; // Güncellenen kullanıcının ID'si
  pictureUrl: string = 'http://localhost:5177/uploads/';
 
  previewUrl: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private userApiService: UserapiService, private route: ActivatedRoute, private router: Router) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      profilePicture: [null],
    });
    const id = this.route.snapshot.paramMap.get('id');
    //alert(id);
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {

      const userData = navigation.extras.state['post'];
      const profilePictureUrl = this.pictureUrl + userData.profilePictureUrl;
      // Formu oluştur ve gelen verileri kullan
      this.userForm.patchValue({
        name: userData.name,
        surname: userData.surname,
        email: userData.email,
        phone: userData.phoneNumber // Eğer 'phoneNumber' mevcutsa
      });

      console.log("this.userForm");
      console.log(this.userForm);

    } else {
      console.warn('Navigation veya state bulunamadı.');
      this.updateUser = {};
    }
  
  }


  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id')); // ID'yi al
    //this.getUserDetail();
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatchedPasswords: true };
  }

  getUserDetail() {
    this.userApiService.getPosts().subscribe(data => {
      this.userForm.patchValue({
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phoneNumber,
        profilePicture: data.profilePictureUrl
      });
    }, error => {
      console.error('❌ Kullanıcı bilgileri alınırken hata oluştu:', error);
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => (this.previewUrl = reader.result);
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      const userDetails = new FormData();
      userDetails.append('id', this.userId.toString());
      userDetails.append('name', this.userForm.get('name')?.value);
      userDetails.append('surname', this.userForm.get('surname')?.value);
      userDetails.append('email', this.userForm.get('email')?.value);
      userDetails.append('phone', this.userForm.get('phone')?.value);

      if (this.selectedFile) {
        userDetails.append('profilePicture', this.selectedFile);
      }

      // updateUserDetail metodu çağrılıyor
      this.userApiService.updateUserDetail(userDetails).subscribe(
        (response: any) => { // 'any' yerine uygun türleri tanımlamak daha iyidir
          console.log('✅ Kullanıcı bilgileri başarıyla güncellendi!', response);
          this.router.navigate(['/users']); // Kullanıcı listesine yönlendir
        },
        (error: any) => { // 'any' yerine uygun türleri tanımlamak daha iyidir
          console.log(error);
        }
      );
    } else {
      console.log('🚨 Form geçersiz! Hatalar:', this.userForm.errors);
    }
  }

  onUpdate(form: FormGroup) {
    if (this.userForm.valid) {
      const userDetails = new FormData();
      userDetails.append('name', this.userForm!.get('name')?.value);
      userDetails.append('surname', this.userForm!.get('surname')?.value);
      userDetails.append('email', this.userForm!.get('email')?.value);
      userDetails.append('phoneNumber', this.userForm!.get('phone')?.value);

      if (this.selectedFile) {
        userDetails.append('profilePicture', this.selectedFile);
      }

      this.userApiService.updateUserDetail(userDetails, this.userId).subscribe(
        response => {
          this.getUserDetail();
          alert(response.message);
          this.router.navigate(['/userMenu']);

        },
        error => {
          console.log(error.error);
        }
      );
    } else {
      console.log('🚨 Form geçersiz! Hatalar:', this.userForm.errors);
      console.log('Form Kontrolleri:', this.userForm.controls);
      Object.keys(this.userForm.controls).forEach(field => {
        const control = this.userForm.get(field);
        if (control?.invalid) {
          console.log(`Hata: ${field} ->`, control.errors);
        }
      });
    }
  }
}
