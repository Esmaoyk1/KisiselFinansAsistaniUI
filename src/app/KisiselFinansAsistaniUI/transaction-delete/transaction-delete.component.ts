import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TransactionApiService } from '../../services/transactionapi.service';

@Component({
  selector: 'app-transaction-delete',
  standalone: true,
  imports: [RouterModule, HttpClientModule, FormsModule],
  templateUrl: './transaction-delete.component.html',
  styleUrl: './transaction-delete.component.css'
})
export class TransactionDeleteComponent implements OnInit {
  hedefId: number | null = null;
  post: any;

  constructor(private route: ActivatedRoute, private router: Router, private transactionApiService: TransactionApiService) {
    const id = this.route.snapshot.paramMap.get('sid'); // ID'yi al
    this.hedefId = id ? +id : null; // String değerini number'a dönüştür

    if (this.hedefId) {
      this.transactionApiService.getPostById(this.hedefId).subscribe(response => {
        this.post = response;
      }, error => {
        console.error('Veri alınırken hata:', error);
      });
    }
  }

  ngOnInit() {

  }

  confirmDelete() {


    if (this.hedefId) {
      /* const confirmDelete = confirm('Bu hedefi silmek istediğinize emin misiniz?');*/
      /*if (confirmDelete) {*/
      this.transactionApiService.deletePost(this.hedefId).subscribe(
        response => {
          console.log('Başarıyla silindi:', response);
          /*  alert('Silme işlemi başarıyla tamamlandı!');*/
          this.router.navigate(['/transaction']);
        },
        error => {
          console.error('Silme hatası:', error);
          alert(error.error.message || 'Silme sırasında bir hata oluştu.');
        }
      );

    }
  }
  cancel() {
    this.router.navigate(['/transaction']); // İptal edildiğinde yönlendirme
  }
}
