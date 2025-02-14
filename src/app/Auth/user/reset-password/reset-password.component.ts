import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserapiService } from '../../../services/user-api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

  resetPasswordForm!: FormGroup;
  token!: string;
  email!: string;
  isSubmitting = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private userApiService: UserapiService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'];
    this.email = this.route.snapshot.queryParams['email'];
    if (!this.token || !this.email) {
      alert("Geçersiz şifre sıfırlama bağlantısı.");
      this.router.navigate(['/']); // Ana sayfaya yönlendir
    }
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  resetPassword() {
    if (this.resetPasswordForm.invalid) return;

    if (this.resetPasswordForm.value.password !== this.resetPasswordForm.value.confirmPassword) {
      this.errorMessage = 'Şifreler uyuşmuyor!';
      return;
    }

    this.isSubmitting = true;

    const resetData = {
      email: this.email,
      token: this.token,
      newPassword: this.resetPasswordForm.value.password
    };

    this.userApiService.resetPassword(resetData).subscribe({
      next: () => {
        alert('Şifreniz başarıyla sıfırlandı!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Bir hata oluştu!';
        this.isSubmitting = false;
      }
    });
  }


}
