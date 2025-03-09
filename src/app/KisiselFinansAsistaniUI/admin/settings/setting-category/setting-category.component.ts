import { Component, Renderer2 } from '@angular/core';
import { CategoryApiService } from '../../../../services/category-api.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-setting-category',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './setting-category.component.html',
  styleUrl: './setting-category.component.css'
})
export class SettingCategoryComponent {

  categories: any[] = [];
  newCategory: string = '';
  newCategoryType:number | null = null;

  editingBankId: number | null = null;

  categoryTypes = [
    { id: 1, name: 'Gelir' },
    { id: 0, name: 'Gider' }
  ];

  constructor(private categoryApiService: CategoryApiService,
    private renderer: Renderer2,
    private router: Router,) { }


  ngOnInit(): void {
    this.loadCategories();
    this.loadScriptsSequentially();
    this.loadCss('assets/vendor/datatables/dataTables.bootstrap4.min.css');
  }


  loadCategories(): void {
    this.categoryApiService.getPosts().subscribe(
      (response) => {
        console.log("Kategoriler:");
        console.log(response);
        if (Array.isArray(response.data.items)) {
          this.categories = response.data.items;
        } else {
          console.error('Beklenmeyen veri formatı:', response.data);
          this.categories = [];
        }
      },
      (error) => {
        console.error('Error fetching categories:', error);
        this.categories = [];
      }
    );
  }

  addCategory(): void {
    if (!this.newCategory) return;

    this.categoryApiService.createPost({ categoryName: this.newCategory, CategoryType: this.newCategoryType }).subscribe(
      (data) => {
        this.categories.push(data);
        this.newCategory = '';

        // Başarılı ekleme alert'i
        alert('Kategori başarıyla eklendi!');
      },
      (error) => {
        console.error('Error adding bank:', error);
        // Hata mesajını kontrol et ve kullanıcıya bildirim göster
        if (error.error && error.error.message) {
          alert(error.error.message); // Sunucudan gelen hata mesajını göster
        } else {
          alert('Kategori eklenirken bir hata oluştu.'); // Genel bir hata mesajı
        }
      }
    );
  }



  editCategory(id: number, category: any): void {
    this.router.navigate(['/settingCategoryUpdate', id], { state: { post: category } });
  }

  cancelEdit(): void {
    this.editingBankId = null;
    this.newCategory = '';
  }

  deleteCategory(id: number): void {
    this.router.navigate(['/settingCategoryDelete', id]); // Silme bileşenine yönlendir
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
