import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserapiService } from '../../../services/user-api.service';

@Component({
  selector: 'app-admin-delete',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './admin-delete.component.html',
  styleUrl: './admin-delete.component.css'
})
export class AdminDeleteComponent {
  adminId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userApiService: UserapiService

  ) {
    const id = this.route.snapshot.paramMap.get('id'); // ID'yi al
    this.adminId = id ? +id : null; // String değerini number'a dönüştür
    alert("id" + id);
  }

  confirmDelete() {
    if (this.adminId) {

      this.userApiService.deletePost(this.adminId).subscribe(
        response => {
          console.log('Başarıyla silindi:', response);
          this.router.navigate(['/adminMenu']);
        },
        error => {
          console.error('Silme hatası:', error);
          alert(error.error.message || 'Silme sırasında bir hata oluştu.');
        }
      );
    }
  }
  cancel() {
    this.router.navigate(['/adminMenu']); // İptal edildiğinde yönlendirme
  }
}
