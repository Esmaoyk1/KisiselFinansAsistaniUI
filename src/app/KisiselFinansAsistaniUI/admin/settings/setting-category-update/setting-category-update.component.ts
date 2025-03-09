import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryApiService } from '../../../../services/category-api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-setting-category-update',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './setting-category-update.component.html',
  styleUrl: './setting-category-update.component.css'
})
export class SettingCategoryUpdateComponent {

  categoryID: number | null = null;
  categoryName: string = '';
  categoryType: Boolean = false;
  category: any;
  post: any;



  constructor(
    private route: ActivatedRoute,
    private categoryApiService: CategoryApiService,
    private router: Router
  ) {
    this.categoryID = +this.route.snapshot.paramMap.get('id')!;

    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.post = navigation.extras.state['post'];
      // Kategori adını ve türünü form alanlarına atıyoruz
      //this.categoryName = this.category.categoryName;
      //this.categoryType = this.category.categoryType;
      console.log("Kategori verisi geldi:", this.post);
    } else {
      this.category = {};
    }
    this.loadCategoryDetails();
  }


  ngOnInit(): void {
    this.categoryID = +this.route.snapshot.paramMap.get('id')!; // ID'yi al

    if (this.categoryID) {
      this.loadCategoryDetails();
    }
  }


  loadCategoryDetails(): void {
    this.categoryApiService.getCategoryById(this.categoryID!).subscribe(
      (response) => {
        this.category = response; // API'den gelen veriyi doğrudan atıyoruz
        //this.post = this.category; // Gelen veriyi post olarak alıp, formu bu veriye bağlayalım
      },
      (error) => {
        console.error('Kategori detayları alınırken hata oluştu:', error);
      }
    );
  }

  updateCategory(): void {
    alert("gjhgjj");
    if (this.categoryID && this.post.categoryName && this.post.categoryType !== '') {
      const updatedCategory = {
        categoryID: this.categoryID,
        categoryName: this.post.categoryName,  // post nesnesindeki kategori adı
        categoryType: this.post.categoryType   // post nesnesindeki kategori türü
      };
      alert("gh");
      console.log("uptadet catgory");
      console.log(updatedCategory);
      this.categoryApiService.updatePost(updatedCategory).subscribe(
        () => {
          alert('Kategori başarıyla güncellendi!');
          this.router.navigate(['/settingCategory']);
        },
        (error) => {
          console.error('Güncelleme sırasında hata oluştu:', error);
          alert('Güncelleme sırasında bir hata oluştu: ' + (error.error?.message || 'Bilinmeyen hata.'));
        }
      );
    } else {
      alert('Lütfen kategori adı ve türünü girin!');
    }
  }

  cancelEdit(): void {
    this.router.navigate(['/settingCategory']); // Düzenlemeyi iptal et ve yönlendir
  }


}
