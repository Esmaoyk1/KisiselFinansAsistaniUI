import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../../menu/menu.component';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SavingApiService } from '../../services/saving.service';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AccountApiService } from '../../services/account-api.service';



@Component({
  selector: 'app-saving',
  standalone: true,
  imports: [RouterModule, MenuComponent, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './saving.component.html',
  styleUrls: ['./saving.component.css']  // Burada styleUrl hatası var, doğru kullanım styleUrls
})
export class SavingComponent {

  hedefler: { goalName: string, goalAmount: number, savedAmount: number, targetDate: string, id: number }[] = [];

  accounts: any[] = [];

  Id: number = 0;
  goalName: string = ''; // Hedef adı
  goalAmount: number = 0; // Hedef miktarı
  savedAmount: number = 0; // Biriktirilen miktar
  targetDate: string = ''; // Tamamlanma tarihi
  AccountID: number = 0;
  selectedHedef: any;

  isUpdateFormVisible: boolean = false;


  post: any; // Güncellenen veri
  hedefId: number | null = null; // Güncellenen hedefin ID'si
  constructor(private router: Router,
    private savingApiService: SavingApiService,
    private accountService: AccountApiService,) {
  }

  ngOnInit() {
    this.savingGet(); // Sayfa yüklendiğinde geçmiş tasarrufları al
    this.loadAccounts();
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const tasarruf = {
        userID: 1,
        AccountID: this.AccountID,
        goalName: this.goalName,
        goalAmount: this.goalAmount,
        savedAmount: this.savedAmount,
        targetDate: new Date(this.targetDate).toISOString().split('T')[0]
      };

      console.log('Gönderilen veri:', tasarruf);
      this.savingCreate(tasarruf);
    } else {
      console.log('Form geçersiz.');
    }
  }

  loadAccounts() {//kullanıcını banka bilgilerini getiryor dropdown için
    this.accountService.getPosts().subscribe(
      resns => {
        this.accounts = resns.data.items; // Hesapları al
        console.log('this.accounts');
        console.log(this.accounts);
      },
      error => {
        console.error('Hesapları yüklerken hata:', error);
      }
    );
  }

  savingCreate(tasarruf: any) {
    this.savingApiService.createPost(tasarruf).subscribe(response => {
      console.log('Başarıyla eklendi:', response);
      this.hedefler.push(tasarruf);
     

      window.location.reload();

    }, error => {
      alert('Hata oluştu: ' + error.error.message);
    });
  }


  savingGet() {
    this.savingApiService.getPosts().subscribe(response => {

      // response.data'nın dizide olup olmadığını kontrol edin
      if (Array.isArray(response.data)) {

        this.hedefler = response.data.items;
        console.log(this.hedefler
        );

      } else {
        // Eğer nesne ise diziyi oluşturun
        this.hedefler = Object.values(response.data.items);

      }
    });
  }

  savingUpdate(sid: number, post: any) {
    this.router.navigate(['savingUpdate', sid], { state: { post: post } });

  }


  guncelle(itemId: number) {
    this.selectedHedef = this.hedefler.find(hedef => hedef.id === itemId);
    this.isUpdateFormVisible = true;
    this.post = { ...this.selectedHedef }; // Seçilen hedefin verilerini kopyala
    this.hedefId = itemId; // Güncellenecek hedefin ID'sini ayarla
  }

  onUpdate(form: NgForm) {
    if (form.valid && this.post) {
      // Güncellenmiş veriyi hazırlayın
      const updatedData = {
        goalName: this.post.goalName,
        goalAmount: this.post.goalAmount,
        savedAmount: this.post.savedAmount,
        targetDate: this.post.targetDate
      };

      // API çağrısını yaparak güncellemeyi veritabanına kaydedin
      this.savingApiService.updatePost(this.Id, updatedData).subscribe(response => {
        console.log('Başarıyla güncellendi:', response);
        alert('Güncelleme işlemi başarıyla tamamlandı!'); // Alert mesajı
        this.router.navigate(['/savings']); // Güncelleme sonrası başka bir sayfaya yönlendirme
      }, error => {
        console.error('Güncelleme hatası:', error);
        alert('Güncelleme sırasında bir hata oluştu.'); // Hata mesajı
      });
    } else {
      console.log('Form geçersiz.');
    }
  }


  deleteHedef(itemId: number) {
    const confirmDelete = confirm('Bu hedefi silmek istediğinize emin misiniz?');
    if (confirmDelete) {
      this.savingApiService.deletePost(itemId).subscribe(response => {
        console.log('Başarıyla silindi:', response);
        this.hedefler = this.hedefler.filter(hedef => hedef.id !== itemId);
      }, error => {
        console.error('Silme hatası:', error);
      });
    }
  }

}
