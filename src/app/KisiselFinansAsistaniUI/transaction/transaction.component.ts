import { Component, Renderer2 } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { TransactionApiService } from '../../services/transactionapi.service';
import { CommonModule } from '@angular/common';
import { AccountApiService } from '../../services/account-api.service';
import { CategoryApiService } from '../../services/category-api.service';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css'
})
export class TransactionComponent {
  transactions: any[] = []; // İşlemler listesini saklamak için
  selectedTransaction: any; // Güncellenmek istenen işlem
  isUpdateFormVisible: boolean = false; // Güncelleme formunun görünürlüğü
  accounts: any[] = [];
  categories: any[] = [];
  targetDate: string = ''; // Tamamlanma tarihi
  constructor(
    private transactionApiService: TransactionApiService,
    private router: Router,
    private accountService: AccountApiService,
    private categoryService: CategoryApiService,
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    this.loadTransactions(); // Bütün işlemleri yükle
    this.loadAccounts();
    this.loadCategories();
    this.loadScriptsSequentially();

    this.loadCss('assets/vendor/datatables/dataTables.bootstrap4.min.css');
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
  loadCategories() {
    this.categoryService.getPosts().subscribe(
      data => {
        if (data.success) { // API yanıtında başarı durumu kontrolü
          this.categories = data.data.items; // Kategorileri al
          console.log('Kategoriler:', this.categories); // Konsola yazdır
        } else {
          console.error('Kategoriler yüklenemedi:', data.message);
        }
      },
      error => {
        console.error('Kategorileri yüklerken hata:', error);
      }
    );
  }
  //loadTransactions(): void {
  //  this.transactionApiService.getPosts().subscribe(
  //    response => {
  //      console.log("*****API den gelen GETRİRİLDİ***" + response);
  //      if (Array.isArray(response.data.items)) {
  //        this.transactions = response.data.items; // İşlemleri al
  //        console.log('İşlemler:', this.transactions);
  //      } else {
  //        console.error('İşlemler dizisi alınamadı:', response.data.items);
  //      }
  //    },
  //    error => {
  //      console.error('İşlemler yüklenirken hata:', error);
  //      alert('Hata oluştu: ' + error.message);
  //    }
  //  );
  //}
  loadTransactions(): void {
    this.transactionApiService.getPosts().subscribe(
      response => {
        console.log("*****API den gelen GETİRİLDİ***", response);
        if (response && response.data && Array.isArray(response.data.items)) {
          this.transactions = response.data.items; // İşlemleri al
          console.log('İşlemler:', this.transactions);

          // transactionType değerlerini kontrol et
          this.transactions.forEach(transaction => {
            console.log('Transaction Type:', transaction.transactionType);
          });
        } else {
          console.error('İşlemler dizisi alınamadı:', response.data.items);
        }
      },
      error => {
        console.error('İşlemler yüklenirken hata:', error);
        alert('Hata oluştu: ' + error.message);
      }
    );
  }

  onSubmit(form: NgForm): void {
    console.log(form.value);
    if (form.valid) {
      const transactionData = {
        accountID: form.value.accountBankId, // Kullanıcının seçtiği hesap ID'si
        userID: 1,       // Geçerli kullanıcı ID'si
        transactionType: form.value.transactionType, // Gelir veya gider
        categoryID: form.value.categoryID, // Seçilen kategori ID'si
        amount: form.value.amount,         // Miktar
        date: new Date(form.value.targetDate).toISOString().split('T')[0],
        description: form.value.description // Açıklama
      };

      this.transactionApiService.createPost(transactionData).subscribe(
        response => {
          console.log('İşlem başarıyla eklendi:', response);
          alert('Ekleme başarılı!'); // Başarı mesajı
          this.loadTransactions(); // İşlemleri yenile
          form.resetForm(); // Formu sıfırla
        },
        error => {
          console.error('İşlem eklenirken hata:', error);
          alert('Hata oluştu: ' + error.message);
        }
      );
    } else {
      console.log('Form geçersiz.');
    }
  }

  guncelle(transaction: any): void {
    this.selectedTransaction = { ...transaction }; // Seçilen işlemi kopyala
    this.isUpdateFormVisible = true; // Güncelleme formunu göster
  }
  transactionUpdate(sid: number, post: any) {
    this.router.navigate(['transactionUpdate', sid], { state: { post: post } });

  }

  onUpdate(form: NgForm): void {
    if (form.valid && this.selectedTransaction) {
      this.transactionApiService.updatePost(this.selectedTransaction.id, form.value).subscribe(
        response => {
          console.log('İşlem başarıyla güncellendi:', response);
          this.loadTransactions(); // İşlemleri yenile
          this.isUpdateFormVisible = false; // Güncelleme formunu gizle
        },
        error => {
          console.error('Güncelleme hatası:', error);
        }
      );
    } else {
      console.log('Form geçersiz.');
    }
  }

  deleteTransaction(id: number): void {
    this.transactionApiService.deletePost(id).subscribe(
      response => {
        console.log('İşlem başarıyla silindi:', response);
        this.loadTransactions(); // İşlemleri yenile
      },
      error => {
        console.error('Silme hatası:', error);
      }
    );
  }

  async loadScriptsSequentially() {
    try {
      await this.loadScript('assets/vendor/jquery/jquery.min.js');
      console.log('jQuery yüklendi.');
      await this.loadScript('assets/vendor/datatables/jquery.dataTables.min.js');
      console.log('DataTables JS yüklendi.');
      await this.loadScript('assets/vendor/datatables/dataTables.bootstrap4.min.js');
      console.log('Bootstrap DataTables yüklendi.');
      await this.loadScript('assets/js/demo/datatables-demo.js');
      console.log('Demo script yüklendi.');
      await this.loadScript('assets/js/test.js');
      console.log('Test script yüklendi.');
    } catch (error) {
      console.error(error);
    }
  }
  loadScript(scriptUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(`Script yüklenemedi: ${scriptUrl}`);
      document.body.appendChild(script);
    });
  }

  private loadCss(url: string) {
    const link = this.renderer.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    this.renderer.appendChild(document.head, link);
  }
}

