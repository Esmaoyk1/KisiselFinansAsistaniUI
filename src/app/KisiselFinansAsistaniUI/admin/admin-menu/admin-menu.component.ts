import { Component, Renderer2 } from '@angular/core';
import { UserapiService } from '../../../services/user-api.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule], 
  templateUrl: './admin-menu.component.html',
  styleUrl: './admin-menu.component.css'
})
export class AdminMenuComponent {
  pictureUrl: string = 'http://localhost:5177/uploads/';
  admins: any[] = [];
  personForm: FormGroup;
  selectedFile!: File;
  previewUrl: string | ArrayBuffer | null = null;
  editingUserId: number | null = null; // Güncellenen kullanıcının ID'si
  role: string = 'Admin';

  constructor(private router: Router, private renderer: Renderer2, private fb: FormBuilder, private userApiService: UserapiService) {
    this.personForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      phone: ['', Validators.required],
      age: ['', Validators.required],
      gender: ['', Validators.required],
      profilePicture: [null],
      role:this.role
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
    console.log("Form verileri:", this.personForm.value);
    if (this.personForm.valid) {
      const userDetails = new FormData();
      userDetails.append('name', this.personForm.get('name')?.value);
      userDetails.append('surname', this.personForm.get('surname')?.value);
      userDetails.append('email', this.personForm.get('email')?.value);
      userDetails.append('phone', this.personForm.get('phone')?.value);
      userDetails.append('age', this.personForm.get('age')?.value);
      userDetails.append('gender', this.personForm.get('gender')?.value);
      userDetails.append('password', this.personForm.get('password')?.value);
      userDetails.append('confirmPassword', this.personForm.get('confirmPassword')?.value);
      userDetails.append('profilePicture', this.selectedFile);
      userDetails.append('role', this.role);


      if (this.editingUserId) {
        // Güncelleme işlemi
        userDetails.append('id', this.editingUserId.toString());
        this.userApiService.updateUserDetail(userDetails).subscribe(
          response => {
            this.getAdmins();
            this.resetForm();
            console.log('✅ Kullanıcı bilgileri başarıyla güncellendi!', response);
          },
          error => {
            console.error('❌ Güncelleme hatası:', error);
          }
        );
      } else {
        // Ekleme işlemi
        this.userApiService.signupPost(userDetails).subscribe(
          response => {
            this.getAdmins();
            this.resetForm();
            console.log('✅ Kullanıcı başarıyla eklendi!', response);
          },
          error => {
            console.error('❌ Kullanıcı eklenirken hata:', error); // Hata mesajını kontrol edin
          }
        );
      }
    } else {
      Object.keys(this.personForm.controls).forEach(field => {
        const control = this.personForm.get(field);
        if (control?.invalid) {
          console.log(`Hata: ${field} ->`, control.errors);
        }
      });
      console.log('🚨 Form geçersiz! Hatalar:', this.personForm.errors);
    }
  }

  resetForm() {
    this.personForm.reset();
    this.editingUserId = null;
    this.selectedFile = null!;
    this.previewUrl = null;
  }

  editAdmin(user: any) {
    this.editingUserId = user.id;
    this.personForm.patchValue({
      name: user.name,
      surname: user.surname,
      email: user.email,
      phone: user.phoneNumber,
      age: user.age,
      gender: user.gender,
      profilePicture: user.profilePictureUrl,
      password: user.password,
      confirmPassword: user.confirmPassword
    });
  }

  deleteAdmin(userId: number) {
    if (confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) {
      this.userApiService.deletePost(userId).subscribe(
        response => {
          this.getAdmins();
          console.log('✅ Kullanıcı başarıyla silindi!', response);
        },
        error => {
          console.error('❌ Kullanıcı silinirken hata oluştu:', error);
        }
      );
    }
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

  ngOnInit(): void {
    this.getAdmins(); // bileşen yüklendiğinde kullanıcıları al
    

  }

  getAdmins(): void {
    this.userApiService.getUsers().subscribe(
      (data) => {
        console.log("admin bilgileri");
        console.log(data.adminUsers);
     
        this.admins = [...data.adminUsers];
        //this.admins = data.adminUsers || []; // adminUsers dizisi olup olmadığını kontrol et
        this.loadScriptsSequentially();
        this.loadCss('assets/vendor/datatables/dataTables.bootstrap4.min.css');
      },
      (error) => {
        console.error('Kullanıcı verileri alınamadı:', error); // Hata durumunu yönet
      }
    );
  }

  adminUpdate(sid: number, post: any) {
    //[routerLink]="['/users/update', user.id]" 
    this.router.navigate(['/admin/update', sid], { state: { post: post } });
  }

  async loadScriptsSequentially() {
    try {
      await this.loadScript('assets/vendor/jquery/jquery.min.js');
      console.log('jQuery yüklendi.');
      await this.loadScript('assets/vendor/datatables/jquery.dataTables.min.js');
      console.log('DataTables JS yüklendi.');
      await this.loadScript('assets/vendor/datatables/dataTables.bootstrap4.min.js');
      console.log('Bootstrap DataTables yüklendi.');
      await this.loadScript('assets/js/demo/datatables-demo.js');
      console.log('Demo script yüklendi.');
      await this.loadScript('assets/js/test.js');
      console.log('Test script yüklendi.');
    } catch (error) {
      console.error(error);
    }
  }

  loadScript(scriptUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(`Script yüklenemedi: ${scriptUrl}`);
      document.body.appendChild(script);
    });
  }

  private loadCss(url: string) {
    const link = this.renderer.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    this.renderer.appendChild(document.head, link);
  }


}
