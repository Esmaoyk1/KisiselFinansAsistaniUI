import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserapiService } from '../../../services/user-api.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  message = '';
  constructor(private fb: FormBuilder,
    private userApiService: UserapiService) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }


  onSubmit() {  // ✅ EKLENDİ
    if (this.forgotPasswordForm.valid) {
      this.userApiService.forgotPassword(this.forgotPasswordForm.value.email).subscribe({
        next: () => this.message = 'E-posta gönderildi, lütfen gelen kutunuzu kontrol edin.',
        error: (err) => this.message = 'Hata: ' + err.error
      });
    }
  }
}
