import { Component, OnInit, Renderer2 } from '@angular/core';
import { UserapiService } from '../../../services/user-api.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule], 
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  pictureUrl: string = 'http://localhost:5177/uploads/';
  users: any[] = []; // Kullanıcı verilerini tutmak için bir dizi
  admins: any[] = [];

  personForm: FormGroup;
  selectedFile!: File;
  previewUrl: string | ArrayBuffer | null = null;
  editingUserId: number | null = null; // Güncellenen kullanıcının ID'si



  ngOnInit(): void {
    this.getUsers(); // bileşen yüklendiğinde kullanıcıları al
    this.loadScriptsSequentially();
    this.loadCss('assets/vendor/datatables/dataTables.bootstrap4.min.css');
    this.getUserDetail();

  }

  constructor(private renderer: Renderer2,private fb: FormBuilder, private userApiService: UserapiService) {
    this.personForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
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
    console.log("this.personForm");
    console.log(this.personForm);
    if (this.personForm.valid) {
      const userDetails = new FormData();
      userDetails.append('name', this.personForm.get('name')?.value);
      userDetails.append('surname', this.personForm.get('surname')?.value);
      userDetails.append('email', this.personForm.get('email')?.value);
      userDetails.append('phone', this.personForm.get('phone')?.value);
      userDetails.append('password', this.personForm.get('password')?.value); // Şifre ekleniyor
      userDetails.append('confirmPassword', this.personForm.get('confirmPassword')?.value);
      userDetails.append('profilePicture', this.selectedFile);

      if (this.editingUserId) {
        // Güncelleme işlemi
        userDetails.append('id', this.editingUserId.toString());
        this.userApiService.updateUserDetail(userDetails).subscribe(
          response => {
            this.getUsers();
            this.resetForm();
            console.log('✅ Kullanıcı bilgileri başarıyla güncellendi!', response);
          },
          error => {
            console.log(error);
          }
        );
      } else {
        // Ekleme işlemi
        this.userApiService.signupPost(userDetails).subscribe(
          response => {
            this.getUsers();
            this.resetForm();
            console.log('✅ Kullanıcı başarıyla eklendi!', response);
          },
          error => {
            console.log(error);
          }
        );
      }
    } else {
      console.log('🚨 Form geçersiz! Hatalar:', this.personForm.errors);
    }
  }

  resetForm() {
    this.personForm.reset();
    this.editingUserId = null;
    this.selectedFile = null!;
    this.previewUrl = null;
  }

  editUser(user: any) {
    this.editingUserId = user.id;
    this.personForm.patchValue({
      name: user.name,
      surname: user.surname,
      email: user.email,
      phone: user.phoneNumber,
      profilePicture: user.profilePictureUrl,
      password: user.password,
      confirmPassword: user.confirmPassword
    });
  }


  deleteUser(userId: number) {
    if (confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) {
      this.userApiService.deletePost(userId).subscribe(
        response => {
          this.getUsers();
          console.log('✅ Kullanıcı başarıyla silindi!', response);
        },
        error => {
          console.error('❌ Kullanıcı silinirken hata oluştu:', error);
        }
      );
    }
  }
  getUserDetail() {
    this.userApiService.getUserDetail().subscribe(data => {
      console.log("data");
      console.log(data);
      //this.personForm.patchValue({
      //  name: data.name,
      //  surname: data.surname,
      //  email: data.email,
      //  phone: data.phoneNumber,
      //  profilePicture: 'http://localhost:5177/uploads/' + data.profilePictureUrl
      //});
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


 
  getUsers(): void {
    this.userApiService.getUsers().subscribe(
      (data) => {
        console.log(data);
        // Admin ve regular kullanıcıları birleştir
        this.users = [...data.regularUsers];
/*        this.admins = [...data.adminUsers];*/
      },
      (error) => {
        console.error('Kullanıcı verileri alınamadı:', error); // Hata durumunu yönet
      }
    );
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
