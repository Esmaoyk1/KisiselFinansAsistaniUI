import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserapiService } from '../../../services/user-api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-update.component.html',
  styleUrl: './admin-update.component.css'
})
export class AdminUpdateComponent {
  updateAdmin: any;
  adminForm: FormGroup;
  profilePictureUrl: string = ''; // Başlangıç değeri atayın
  selectedFile: File | null = null; // Seçilen dosya

  userId!: number; // Güncellenen kullanıcının ID'si
  pictureUrl: string = 'http://localhost:5177/uploads/';

  previewUrl: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private userApiService: UserapiService, private route: ActivatedRoute, private router: Router) {
    this.adminForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      age: ['', Validators.required],
      gender: ['', Validators.required],
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
      this.adminForm.patchValue({
        name: userData.name,
        surname: userData.surname,
        age: userData.age,
        gender:userData.gender,
        email: userData.email,
        phone: userData.phoneNumber // Eğer 'phoneNumber' mevcutsa
      });

      console.log("this.userForm");
      console.log(this.adminForm);

    } else {
      console.warn('Navigation veya state bulunamadı.');
      this.updateAdmin = {};
    }

  }

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatchedPasswords: true };
  }

  getAdminDetail() {
    this.userApiService.getPosts().subscribe(data => {
      this.adminForm.patchValue({
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phoneNumber,
        age: data.age,
        gender: data.gender,
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
    if (this.adminForm.valid) {
      const userDetails = new FormData();
      userDetails.append('id', this.userId.toString());
      userDetails.append('name', this.adminForm.get('name')?.value);
      userDetails.append('surname', this.adminForm.get('surname')?.value);
      userDetails.append('email', this.adminForm.get('email')?.value);
      userDetails.append('phone', this.adminForm.get('phone')?.value);

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
      console.log('🚨 Form geçersiz! Hatalar:', this.adminForm.errors);
    }
  }

  onUpdate(form: FormGroup) {
    if (this.adminForm.valid) {
      const userDetails = new FormData();
      userDetails.append('name', this.adminForm!.get('name')?.value);
      userDetails.append('surname', this.adminForm!.get('surname')?.value);
      userDetails.append('email', this.adminForm!.get('email')?.value);
      userDetails.append('phoneNumber', this.adminForm!.get('phone')?.value);
      userDetails.append('age', this.adminForm!.get('age')?.value);
      userDetails.append('gender', this.adminForm!.get('gender')?.value);

      if (this.selectedFile) {
        userDetails.append('profilePicture', this.selectedFile);
      }

      this.userApiService.updateUserDetail(userDetails, this.userId).subscribe(
        response => {
          this.getAdminDetail();
          alert(response.message);
          this.router.navigate(['/adminMenu']);

        },
        error => {
          console.log(error.error);
        }
      );
    } else {
      console.log('🚨 Form geçersiz! Hatalar:', this.adminForm.errors);
      console.log('Form Kontrolleri:', this.adminForm.controls);
      Object.keys(this.adminForm.controls).forEach(field => {
        const control = this.adminForm.get(field);
        if (control?.invalid) {
          console.log(`Hata: ${field} ->`, control.errors);
        }
      });
    }
  }
}
