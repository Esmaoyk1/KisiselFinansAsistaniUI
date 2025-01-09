import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BudgetService } from '../../services/budget.service';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CategoryApiService } from '../../services/category-api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-budget-update',
  standalone: true,
  imports: [RouterModule, FormsModule, HttpClientModule, CommonModule],
  providers: [CategoryApiService],
  templateUrl: './budget-update.component.html',
  styleUrl: './budget-update.component.css'
})
export class BudgetUpdateComponent {
  hedefId: number | null = null;
  post: any;
  items: { id: number, categoryName: string, categoryType: string }[] = [];

  dizi: any= [];
  //"items": [
  //  {
  //    "id": 1,
  //    "categoryName": "Eğlence",
  //    "categoryType": "gider"
  //  },
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private budgetApiService: BudgetService,
    private categoryApiService: CategoryApiService

  ) {
    this.loadCategoryItems();

    console.log("items : "+this.items);
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
    this.hedefId = this.post.budgetId; // Eğer post içinde id varsa
   
  }
  private loadCategoryItems(): void {
    this.categoryApiService.getPosts().subscribe({
      next: (categories) => {
        this.items = categories.data.items; // API'den gelen veriyi items'a ata
        console.log("Categories loaded: ", this.items);

      },
      error: (err) => {
        console.error("Category loading failed: ", err);
      }
    });
  }
  loadCategoryItems2() {
    this.categoryApiService.getPosts().subscribe(response => {
      //console.log('Category API Yanıtı:', response); 
   
      if (response && response.data && Array.isArray(response.data.items)) {
        console.log("apien gelen : " + response.data.items[0][0]);
        this.items = response.data.items;
        //alert(this.items[0].categoryName);
      
        //console.log(this.items);
      } else {
        console.error('Beklenen dizi değil:', response);
        this.items = []; 
      }
    }, error => {
      console.error('Hata:', error);
      this.items = [];
    });
  }
  onUpdate(form: NgForm) {
    //alert("upd");
    if (form.valid && this.hedefId) {
      const updatedData = {
        categoryID: this.post.categoryID,
        amount: this.post.amount,
        startDate: this.post.startDate,
        endDate: this.post.endDate,
        budgetID: this.hedefId
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


