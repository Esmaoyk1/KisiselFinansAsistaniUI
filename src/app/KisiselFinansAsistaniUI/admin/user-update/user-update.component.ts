import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserapiService } from '../../../services/user-api.service';

@Component({
  selector: 'app-user-update',
  standalone: true,
  imports: [],
  templateUrl: './user-update.component.html',
  styleUrl: './user-update.component.css'
})
export class UserUpdateComponent {

  userForm: FormGroup;
  userId!: number; // Güncellenen kullanıcının ID'si
  pictureUrl: string = 'http://localhost:5177/uploads/';
  selectedFile!: File;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private userApiService: UserapiService, private route: ActivatedRoute, private router: Router) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      profilePicture: [null],
    }, {
      validators: this.passwordMatchValidator
    });
  }


  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id')); // ID'yi al
    this.getUserDetail();
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
      userDetails.append('password', this.userForm.get('password')?.value);
      userDetails.append('profilePicture', this.selectedFile);

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
}
