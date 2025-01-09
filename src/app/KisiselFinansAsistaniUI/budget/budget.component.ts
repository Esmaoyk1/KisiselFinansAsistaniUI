import { Component, OnInit, Renderer2 } from '@angular/core';
import { BudgetService } from '../../services/budget.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, RouterModule],
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css'] // styleUrl yerine styleUrls kullanılmalı
})
export class BudgetComponent implements OnInit {

  items: { categoryID: number, amount: number, startDate: string, endDate: string, budgetId:number,categoryName:string}[] = [];
  newItem = { categoryID: 0, amount: 0, startDate: '', endDate: '', budgetId: 0, categoryName:'' };
  selectedItem: any; // Güncellenen öğeyi tutacak değişken
  isUpdateFormVisible: boolean = false; // Güncelleme formunun görünürlüğü

  constructor(private renderer: Renderer2, private budgetService: BudgetService, private router: Router) { }

  ngOnInit() {
    this.loadScriptsSequentially();

    this.loadCss('assets/vendor/datatables/dataTables.bootstrap4.min.css');

    this.loadItems(); // Sayfa yüklendiğinde bütçe öğelerini al
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
      this.newItem = { categoryID: 0, amount: 0, startDate: '', endDate: '', budgetId: 0, categoryName :''}; // Formu sıfırla
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



