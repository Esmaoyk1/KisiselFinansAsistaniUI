import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BudgetService } from '../../services/budget.service';

@Component({
  selector: 'app-budget-delete',
  standalone: true,
  imports: [RouterModule, HttpClientModule, FormsModule],
  templateUrl: './budget-delete.component.html',
  styleUrl: './budget-delete.component.css'
})
export class BudgetDeleteComponent {
  hedefId: number | null = null;
  post: any;


  constructor(private route: ActivatedRoute, private router: Router, private budgetApiService: BudgetService) {
    const id = this.route.snapshot.paramMap.get('sid'); // ID'yi al
    this.hedefId = id ? +id : null; // String değerini number'a dönüştür

    if (this.hedefId) {
      this.budgetApiService.getPostById(this.hedefId).subscribe(response => {
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
      this.budgetApiService.deletePost(this.hedefId).subscribe(
        response => {
          console.log('Başarıyla silindi:', response);
          /*  alert('Silme işlemi başarıyla tamamlandı!');*/
          this.router.navigate(['/budget']);
        },
        error => {
          console.error('Silme hatası:', error);
          alert(error.error.message || 'Silme sırasında bir hata oluştu.');
        }
      );

    }
  }
  cancel() {
    this.router.navigate(['/budget']); // İptal edildiğinde yönlendirme
  }

}
