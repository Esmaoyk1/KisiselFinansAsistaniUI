import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionApiService } from '../../services/transactionapi.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CategoryApiService } from '../../services/category-api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction-update',
  standalone: true,
  imports: [FormsModule, CommonModule], // Add FormsModule here
  templateUrl: './transaction-update.component.html',
  styleUrls: ['./transaction-update.component.css']
})
export class TransactionUpdateComponent implements OnInit {
  hedefId: number | null = null;
  post: any = {
    transactionType: null,
    categoryID: null,
    amount: null,
    description: '',
    date: null
  };
  // Başlangıçta boş bir nesne
  isUpdateFormVisible: boolean = true; // Form görünürlüğü

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transactionApiService: TransactionApiService,
    private categoryApiService: CategoryApiService

  ) {

    const id = this.route.snapshot.paramMap.get('id');
    //this.hedefId? = id;
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.post = navigation.extras.state['post'];
      //this.post.date = new Date(this.post.targetDate).toISOString().split('T')[0];
    } else {
      console.warn('Navigation veya state bulunamadı.');
      this.post = {};
    }
    console.log("this.post versisi geldi :");
    console.log(this.post);
    console.log("id versisi : ");
    console.log(this.post.id);

  }



  //ngOnInit() {
  //  this.route.params.subscribe(params => {
  //    this.hedefId = +params['id']; // URL'den ID'yi alıyoruz
  //    this.loadTransaction(); // İşlemi yükle
  //  });
  //}
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.hedefId = +params['id']; // ID'yi URL'den alın
      if (this.hedefId) {
        this.loadTransaction(); // Veriyi yükleyin
      }
    });
  }


  private loadTransaction() {
    if (this.hedefId) {
      this.transactionApiService.getPosts().subscribe(
        response => {
          this.post = response; // Sunucudan gelen veriyi post'a atıyoruz
          console.log('İşlem yüklendi:', this.post);
        },
        error => {
          console.error('İşlem yüklenirken hata:', error);
          alert('İşlem yüklenirken bir hata oluştu.');
        }
      );
    }
  }

  onUpdate(form: NgForm) {
    //Object.keys(form.controls).forEach(key => {
    //  const control = form.controls[key];
    //  console.log(`Alan Adı: ${key}`);
    //  console.log('Değer:', control.value);
    //  console.log('Geçerli mi:', control.valid);
    //  console.log('Hatalar:', control.errors);
    //});
    console.log("this.post.id" + this.post.id);
    if (form.valid && this.post.id) {

      const updatedData = {                                          //{
        TransactionID: this.post.id,                                 //  "transactionID": 0,
        userID: 1,                                                   //  "accountID": 0,
        accountID: 9,                                                //  "userID": 0,
        transactionType: this.post.transactionType,                  //  "transactionType": true,
        categoryID: this.post.categoryID,                            //  "categoryID": 0,
        amount: this.post.amount,                                    //  "amount": 0,
        description: this.post.description,                          //  "date": "2025-01-19T19:09:05.013Z",
        date: new Date(this.post.date).toISOString().slice(0, 16)    //  "description": "string"
                                                                     //}
      };
     
      this.transactionApiService.updatePost(this.post.id, updatedData).subscribe(
        response => {
          console.log('Başarıyla güncellendi:', response);
          alert('Güncelleme işlemi başarıyla tamamlandı!');
          this.router.navigate(['/transaction']);
        },
        error => {
          console.error('Güncelleme hatası:', error);
          alert(error.error.message);
        }
      );
    } else {
      console.log('Form geçersiz.');
    }
    console.log('Form Geçerli mi:', form.valid);
    console.log('Form Değerleri:', form.value);

  }
}
