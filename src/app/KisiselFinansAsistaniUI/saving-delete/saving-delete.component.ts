import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SavingApiService } from '../../services/saving.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-saving-delete',
  standalone: true,
  imports: [RouterModule, HttpClientModule, FormsModule],
  templateUrl: './saving-delete.component.html',
  styleUrls: ['./saving-delete.component.css']
})
export class SavingDeleteComponent implements OnInit {
  hedefId: number | null = null;
  post: any;

  constructor(private route: ActivatedRoute, private router: Router, private savingApiService: SavingApiService) {
    const id = this.route.snapshot.paramMap.get('sid'); // ID'yi al
    this.hedefId = id ? +id : null; // String değerini number'a dönüştür

    if (this.hedefId) {
      this.savingApiService.getPostById(this.hedefId).subscribe(response => {
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
      this.savingApiService.deletePost(this.hedefId).subscribe(
        response => {
          console.log('Başarıyla silindi:', response);
          /*  alert('Silme işlemi başarıyla tamamlandı!');*/
          this.router.navigate(['/saving']);
        },
        error => {
          console.error('Silme hatası:', error);
          alert(error.error.message || 'Silme sırasında bir hata oluştu.');
        }
      );
     
    }
  }
  cancel() {
    this.router.navigate(['/saving']); // İptal edildiğinde yönlendirme
  }
}
