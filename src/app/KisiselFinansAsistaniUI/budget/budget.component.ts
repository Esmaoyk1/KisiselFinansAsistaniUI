import { Component, Inject, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { BudgetService } from '../../services/budget.service';
//import { HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CategoryApiService } from '../../services/category-api.service';
import { TransactionApiService } from '../../services/transactionapi.service';
import { isPlatformBrowser } from '@angular/common'; // ✅ isPlatformBrowser ile kontrol edeceğiz

import { Modal } from 'bootstrap'; // Bootstrap'in Modal bileşenini içe akta
import { AccountApiService } from '../../services/account-api.service';
@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  providers: [CategoryApiService],
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css'] // styleUrl yerine styleUrls kullanılmalı

})
export class BudgetComponent implements OnInit {
  butce: any[] = []; // Mevcut bütçeleri tutmak için
  selectedTransactionType: boolean | null = null;
  categories: any[] = [];
  filteredCategories() {
    /* console.log(this.selectedTransactionType);*/
    /* console.log(this.categories);*/

    return this.categories.filter(category =>
      category.categoryType == "0" &&
      (this.selectedTransactionType === null || category.categoryType == this.selectedTransactionType)
    );
  }


  categoryItems: { id: number, categoryName: string, categoryType: string }[] = [];
  items: { categoryID: number, amount: number, startDate: string, endDate: string, budgetId: number, categoryName: string }[] = [];
  newItem = { categoryID: 0, amount: 0, startDate: '', endDate: '', budgetId: 0, categoryName: '' };
  selectedItem: any = 0; // Güncellenen öğeyi tutacak değişken
  isUpdateFormVisible: boolean = false; // Güncelleme formunun görünürlüğü

  constructor(
    private renderer: Renderer2,
    private budgetService: BudgetService,
    private router: Router,
    private categoryApiService: CategoryApiService,
    private transactionApiService: TransactionApiService,
    private accountService: AccountApiService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadCategoryItems();
  }
  private modalInstance!: Modal; // Modal için referans

  selectedBudget: { amount: number | null, selectedAccountId: number | null } = { amount: null, selectedAccountId: null }; // Başlangıçta amount null
  accounts: any[] = [];

  async ngOnInit() {
    this.loadScriptsSequentially();

    this.loadCss('assets/vendor/datatables/dataTables.bootstrap4.min.css');

    this.loadItems(); // Sayfa yüklendiğinde bütçe öğelerini al
    this.loadCategoryItems();
    // Modal nesnesini al ve başlat
    const modalElement = document.getElementById('exampleModal') as HTMLElement;
    if (isPlatformBrowser(this.platformId)) { // ✅ Sadece tarayıcıda çalışmasını sağlıyoruz
      const bootstrap = await import('bootstrap'); // ✅ Bootstrap'i dinamik olarak yüklüyoruz
      const modalElement = document.getElementById('exampleModal') as HTMLElement;
      if (modalElement) {
        this.modalInstance = new bootstrap.Modal(modalElement);
      }
    }
  }

  openModal(item: any) {
    this.selectedBudget = item;
    console.log(item);
    console.log("tt");
    this.loadAccounts();
    this.modalInstance?.show();
  }

  closeModal() {
    this.modalInstance?.hide();
  }
  completedBudget(selectedBudget: any) {

    //transaction add işlemi yapıcak
    console.log(selectedBudget.selectedAccountId);
    const transaction = {
      accountID: this.selectedBudget.selectedAccountId, // Kullanıcının hesap ID'sini buraya ekleyin
      userID: 0 /* Kullanıcı ID'sini buradan alın */,
      transactionType: false, // Pozitif bir işlem olduğunu belirtiyoruz
      categoryID: selectedBudget.categoryID, // Bütçenin kategorisi
      amount: selectedBudget.amount, // Bütçenin miktarı
      date: new Date().toISOString(), // Bugünün tarihi
      description: "Bütçeyi kullandım" // Açıklama
    };

    // Transaction'ı kaydet
    this.transactionApiService.createPost(transaction).subscribe(
      response => {
        //alert("Bütçe kullanımı başarıyla kaydedildi.");
        // İlgili işlemleri gerçekleştirin (örneğin, listeyi güncelleyin)

        this.budgetService.deletePost(selectedBudget.budgetId).subscribe(

          response => {
            this.closeModal();
            alert("İşlem Başarılı");
            //alert("Bütçe kullanımı başarıyla kaydedildi.");
            // İlgili işlemleri gerçekleştirin (örneğin, listeyi güncelleyin)
          },
          error => {
            console.error("Hata:", error.error.message);
            alert("Bir hata oluştu.");
          }
        );
      },
      error => {
        console.error("Hata:", error.error.message);
        alert(error.error.message);
      }
    );
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
  markAsCompleted(butce: any) {
    // Onay penceresi
    const confirmation = confirm("Ayırdığınız bütçeyi kullandınız mı? Evet ya da Hayır?");

    if (confirmation) {
      // Kullanıcı "Evet" derse, transaction nesnesini oluştur
      const transaction = {
        accountID: 34, // Kullanıcının hesap ID'sini buraya ekleyin
        userID: 31 /* Kullanıcı ID'sini buradan alın */,
        transactionType: false, // Pozitif bir işlem olduğunu belirtiyoruz
        categoryID: butce.categoryID, // Bütçenin kategorisi
        amount: butce.amount, // Bütçenin miktarı
        date: new Date().toISOString(), // Bugünün tarihi
        description: "Bütçeyi kullandım" // Açıklama
      };

      // Transaction'ı kaydet
      this.transactionApiService.createPost(transaction).subscribe(
        response => {
          alert("Bütçe kullanımı başarıyla kaydedildi.");
          // İlgili işlemleri gerçekleştirin (örneğin, listeyi güncelleyin)
        },
        error => {
          console.error("Hata:", error);
          alert("Bir hata oluştu.");
        }
      );
    } else {
      // Kullanıcı "Hayır" derse
      this.budgetService.deletePost(butce.budgetId).subscribe(
        response => {
          alert("Bütçe başarıyla silindi.");
          // İlgili işlemleri gerçekleştirin (örneğin, listeyi güncelleyin)
        },
        error => {
          console.error("Hata:", error);
          alert("Bir hata oluştu.");
        }
      );
    }
  }



  private loadCategoryItems(): void {
    this.categoryApiService.getPosts().subscribe({
      next: (categories) => {
        this.categories = categories.data.items; // API'den gelen veriyi items'a ata
        this.filteredCategories();
        console.log("Categories loaded: ", this.items);

      },
      error: (err) => {
        console.error("Category loading failed: ", err);
      }


    });
  }
  loadItems() {
    this.budgetService.getPostsBudgetByUser(1).subscribe(response => {
      console.log('API Yanıtı:', response); // Yanıtı kontrol edin

      // Yanıtın içindeki data nesnesini kontrol edin
      if (response && response.data && Array.isArray(response.data.items)) {
        this.items = response.data.items; // items dizisine atama yapın
      } else {
        console.error('Beklenen dizi değil:', response);
        this.items = []; // Hata durumunda boş dizi atayın
      }
    }, error => {
      console.error('Hata:', error);
      this.items = []; // Hata durumunda boş dizi atayın
    });
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.budgetCreate();
    } else {
      console.log('Form geçersiz.');
    }
  }

  budgetCreate() {
    this.budgetService.createPost(this.newItem).subscribe(response => {
      console.log('Başarıyla eklendi:', response);
      this.items.push({ ...this.newItem }); // Yeni öğeyi diziye ekle
      alert("Başarıyla Eklendi");
      this.newItem = { categoryID: 0, amount: 0, startDate: '', endDate: '', budgetId: 0, categoryName: '' }; // Formu sıfırla
    }, error => {
      console.error('Ekleme hatası:', error);
    });
  }

  guncelle(item: any) {
    this.selectedItem = { ...item }; // Seçilen öğeyi kopyala
    this.isUpdateFormVisible = true; // Güncelleme formunu göster
  }

  budgetUpdate(sid: number, post: any) {
    this.router.navigate(['budgetUpdate', sid], { state: { post: post } });

  }
  onUpdate(form: NgForm) {
    if (form.valid && this.selectedItem) {
      this.budgetService.updatePost(this.selectedItem.categoryID, this.selectedItem).subscribe(response => {
        console.log('Başarıyla güncellendi:', response);
        const index = this.items.findIndex(item => item.categoryID === this.selectedItem.categoryID);
        if (index !== -1) {
          this.items[index] = this.selectedItem; // Dizi içindeki öğeyi güncelle
        }
        this.isUpdateFormVisible = false; // Güncelleme formunu gizle
      }, error => {
        console.error('Güncelleme hatası:', error);
      });
    } else {
      console.log('Form geçersiz.');
    }
  }

  deleteHedef(itemId: number) {
    const confirmDelete = confirm('Bu öğeyi silmek istediğinize emin misiniz?');
    if (confirmDelete) {
      this.budgetService.deletePost(itemId).subscribe(response => {
        console.log('Başarıyla silindi:', response);
        this.items = this.items.filter(item => item.categoryID !== itemId); // Öğeyi diziden çıkar
      }, error => {
        console.error('Silme hatası:', error);
      });
    }
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



