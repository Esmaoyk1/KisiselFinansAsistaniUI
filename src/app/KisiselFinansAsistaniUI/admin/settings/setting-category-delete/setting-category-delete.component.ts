import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryApiService } from '../../../../services/category-api.service';

@Component({
  selector: 'app-setting-category-delete',
  standalone: true,
  imports: [],
  templateUrl: './setting-category-delete.component.html',
  styleUrl: './setting-category-delete.component.css'
})
export class SettingCategoryDeleteComponent {

  hedefId: number | null = null;
  post: any;

  constructor(private route: ActivatedRoute, private router: Router, private categoryApiService: CategoryApiService) {
    const id = this.route.snapshot.paramMap.get('id'); // ID'yi al
    this.hedefId = id ? +id : null; // String değerini number'a dönüştür

    if (this.hedefId) {
      this.categoryApiService.getPosts().subscribe(response => {
        this.post = response;
      }, error => {
        console.error('Veri alınırken hata:', error);
      });
    }
  }

  confirmDelete() {
    if (this.hedefId) {
      this.categoryApiService.deletePost(this.hedefId).subscribe(
        response => {
          console.log('Başarıyla silindi:', response);
          alert('Silme işlemi başarıyla tamamlandı!'); // Burada alert'i çağırıyoruz
          this.router.navigate(['/settingCategory']);
        },
        error => {
          console.error('Silme hatası:', error);
          alert(error.error.message || 'Silme sırasında bir hata oluştu.');
        }
      );
    }
  }
  cancel() {
    this.router.navigate(['/settingCategory']); // İptal edildiğinde yönlendirme
  }
}
