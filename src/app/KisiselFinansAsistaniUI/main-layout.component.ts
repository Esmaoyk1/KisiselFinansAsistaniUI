import { Component, OnInit, inject } from '@angular/core';

import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { SavingApiService } from '../services/saving.service';
import { CommonModule } from '@angular/common';
import { TransactionApiService } from '../services/transactionapi.service';
import { UserapiService } from '../services/user-api.service';
import { BudgetService } from '../services/budget.service';
import { response } from 'express';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../Auth/auth-service.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  templateUrl: './main-layout.component.html',
  imports: [RouterModule, FormsModule, RouterOutlet, MenuComponent, SearchBarComponent, CommonModule],
})
export class MainLayoutComponent implements OnInit {
  hedefler: any[] = [];
  categories: any[] = [];
  userProfileDetail: any= [];
  tarih: any[] = [];

  constructor(
    public authService: AuthService,
    private savingApiService: SavingApiService,
    private transactionApiService: TransactionApiService,
    private userApiService: UserapiService,
    private budgetApiService: BudgetService,
    private router: Router
  ) { }


  async ngOnInit() {
    this.getHighSavingsByUser(); // Örnek olarak 1 kullanıcı ID'si kullanıldı
    this.getTransactionPercentageByAccount(1);
    this.getUserProfileDetail(); // Kullanıcı ID'sine göre profil fotoğrafını al
    this.getBudgetEndDate();

  }
  logout() {
    // Modal'ı kapatma
    const modal = document.querySelector('.modal') as HTMLElement;
    if (modal) {
      modal.style.display = 'none';
    }
    // Modal backdrop'ı kaldırma
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.remove();
    }
    this.authService.logout();
    this.router.navigate(['/login']); 
  }

  getUserProfileDetail() {
    this.userApiService.getUserDetail().subscribe(response => {
      if (response && response) {
        this.userProfileDetail = response;
        this.userProfileDetail.profilePictureUrl = 'http://localhost:5177/uploads/' + response.profilePictureUrl;
        console.log('Kullanıcı Bilgileri:', this.userProfileDetail);
      } else {
        console.log('Kullanıcı profil fotoğrafı veri formatı:', response);
      }
    }, error => {
      console.error('Kullanıcı profil fotoğrafı alma hatası:', error);
    });
  }
  getHighSavingsByUser() {
    this.savingApiService.GetHighSavingsByUser().subscribe(response => {
      if (response && response.data && Array.isArray(response.data.items)) {
        this.hedefler = response.data.items; // Gelen veriyi hedefler dizisine ata
        console.log('Yüksek tasarruflar:', this.hedefler);
      } else {
        console.log('Geçersiz veri formatı:', response);
      }
    }, error => {
      //alert(error.error.message);
    });
  }

  getTransactionPercentageByAccount(id: number) {
    this.transactionApiService.GetTransactionPercentageByAccount(id).subscribe(
      (response) => {
        console.log(response); // API yanıtını kontrol etmek için
        if (response && response.data && Array.isArray(response.data.items)) {
          // Yüzde 50'yi aşan kategorileri filtrele
          this.categories = response.data.items.filter((category: any) => category.percentage > 50); // `any` tipini kullanıyoruz

          // Filtrelenen kategorilere `isHighPercentage` özelliğini ekleyelim
          this.categories.forEach((category: any) => {
            category.isHighPercentage = true;
          });

          console.log('Yüksek Yüzdeli Kategoriler:', this.categories);
        } else {
          console.log('Geçersiz veri formatı:', response);
        }
      },
      (error) => {
        console.error('Veri alma hatası:', error);
      }
    );
  }


  getBudgetEndDate() {
    this.budgetApiService.getPosts().subscribe(response => {
      if (response.success && response.data.items) {
        const today = new Date(); // Bugünün tarihi

        // Filtreleme işlemi
        const filteredItems = response.data.items.filter((item: any) => {
          const endDate = new Date(item.endDate); // endDate'i Date objesine çevir
          return endDate <= today; // Bugün veya daha sonrası
        });

        this.tarih = filteredItems; // Filtrelenmiş veriyi tarih dizisine ata
        console.log(this.tarih); // Filtrelenmiş veriyi görmek için
      }
    });
  }
}
