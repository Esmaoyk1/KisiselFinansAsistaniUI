import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BanksApiService } from '../../../../services/banks-api.service';

@Component({
  selector: 'app-setting-bank-delete',
  standalone: true,
  imports: [],
  templateUrl: './setting-bank-delete.component.html',
  styleUrl: './setting-bank-delete.component.css'
})
export class SettingBankDeleteComponent {

  hedefId: number | null = null;
  post: any;

  constructor(private route: ActivatedRoute, private router: Router, private bankApiService: BanksApiService) {
    const id = this.route.snapshot.paramMap.get('sid'); // ID'yi al
    this.hedefId = id ? +id : null; // String değerini number'a dönüştür

    if (this.hedefId) {
      this.bankApiService.getBankId(this.hedefId).subscribe(response => {
        this.post = response;
      }, error => {
        console.error('Veri alınırken hata:', error);
      });
    }
  }

  confirmDelete() {
    if (this.hedefId) {
      /* const confirmDelete = confirm('Bu hedefi silmek istediğinize emin misiniz?');*/
      /*if (confirmDelete) {*/
      this.bankApiService.deletePost(this.hedefId).subscribe(
        response => {
          console.log('Başarıyla silindi:', response);
          /*  alert('Silme işlemi başarıyla tamamlandı!');*/
          this.router.navigate(['/settingBank']);
        },
        error => {
          console.error('Silme hatası:', error);
          alert(error.error.message || 'Silme sırasında bir hata oluştu.');
        }
      );

    }
  }
  cancel() {
    this.router.navigate(['/settingBank']); // İptal edildiğinde yönlendirme
  }

}
