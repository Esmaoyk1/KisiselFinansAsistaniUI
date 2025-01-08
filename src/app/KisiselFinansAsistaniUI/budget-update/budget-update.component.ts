import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BudgetService } from '../../services/budget.service';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-budget-update',
  standalone: true,
  imports: [RouterModule, FormsModule, HttpClientModule],
  templateUrl: './budget-update.component.html',
  styleUrl: './budget-update.component.css'
})
export class BudgetUpdateComponent {
  hedefId: number | null = null;
  post: any;

  constructor(private route: ActivatedRoute, private router: Router, private budgetApiService: BudgetService) {
    const id = this.route.snapshot.paramMap.get('id');
    //this.hedefId? = id;
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.post = navigation.extras.state['post'];
      this.post.startDate = new Date(this.post.startDate).toISOString().split('T')[0];
      this.post.endDate = new Date(this.post.endDate).toISOString().split('T')[0];
    } else {
      console.warn('Navigation veya state bulunamadı.');
      this.post = {};
    }
  }

  ngOnInit() {
    this.hedefId = this.post.id; // Eğer post içinde id varsa
  }

  onUpdate(form: NgForm) {
    if (form.valid && this.hedefId) {
      const updatedData = {
        categoryID: this.post.categoryID,
        amount: this.post.amount,
        startDate: this.post.startDate,
        endDate: this.post.endDate,
        id: this.hedefId
      };

      this.budgetApiService.updatePost(this.hedefId, updatedData).subscribe(response => {

        console.log('Başarıyla güncellendi:', response);
        alert('Güncelleme işlemi başarıyla tamamlandı!');
        this.router.navigate(['/budget']);
      }, error => {

        console.error('Güncelleme hatası:', error);
        alert(error.error.message);
      });
    } else {
      console.log('Form geçersiz.');
    }
  }
}


