import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserapiService } from '../../../services/user-api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-delete',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './user-delete.component.html',
  styleUrl: './user-delete.component.css'
})
export class UserDeleteComponent {
  userId: number | null = null;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userApiService: UserapiService

  ) {
    const id = this.route.snapshot.paramMap.get('id'); // ID'yi al
    this.userId = id ? +id : null; // String değerini number'a dönüştür
    alert("id" + id);
  }

  confirmDelete() {


    if (this.userId) {
     
      this.userApiService.deletePost(this.userId).subscribe(
        response => {
          console.log('Başarıyla silindi:', response);
          this.router.navigate(['/userMenu']);
        },
        error => {
          console.error('Silme hatası:', error);
          alert(error.error.message || 'Silme sırasında bir hata oluştu.');
        }
      );

    }
  }
  cancel() {
    this.router.navigate(['/userMenu']); // İptal edildiğinde yönlendirme
  }
}
