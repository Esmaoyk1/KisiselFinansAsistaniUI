import { Component, OnInit, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { SavingApiService } from '../services/saving.service';
import { CommonModule } from '@angular/common';
import { TransactionApiService } from '../services/transactionapi.service';
import { UserapiService } from '../services/user-api.service';
//import { HttpClient } from '@angular/common/http';
//import { AuthService } from '../Auth/auth-service.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  templateUrl: './main-layout.component.html',
  imports: [RouterModule,RouterOutlet, MenuComponent, SearchBarComponent, CommonModule],
})
export class MainLayoutComponent implements OnInit {
  hedefler: any[] = [];
  categories: any[] = [];
  userProfilePictureUrl: string = ''; // Profil fotoğrafı URL'si için değişken

  constructor(private savingApiService: SavingApiService,
    private transactionApiService: TransactionApiService,
    private userApiService : UserapiService) { }


  ngOnInit() {
    this.getHighSavingsByUser(1); // Örnek olarak 1 kullanıcı ID'si kullanıldı
    this.getTransactionPercentageByAccount(1);
    this.getUserProfilePicture(1); // Kullanıcı ID'sine göre profil fotoğrafını al


  }
  getHighSavingsByUser(userId: number) {
    this.savingApiService.GetHighSavingsByUser(userId).subscribe(response => {
      console.log("metod calıştııı");
      if (response && response.data && Array.isArray(response.data.items)) {
        this.hedefler = response.data.items; // Gelen veriyi hedefler dizisine ata
        console.log('Yüksek tasarruflar:', this.hedefler);
      } else {
        console.log('Geçersiz veri formatı:', response);
      }
    }, error => {
      console.error('Veri alma hatası:', error);
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

  getUserProfilePicture(userId: number) {
    //this.userProfilePictureUrl = 'https://cdn.pixabay.com/photo/2012/04/11/11/53/user-27716_1280.png'; // Test URL'si

    this.userApiService.getUserProfilePicture(userId).subscribe(response => {
      if (response && response.profilePictureUrl) {
        this.userProfilePictureUrl = response.profilePictureUrl; // Yeni formatta URL'yi alıyoruz
        console.log('Kullanıcı profil fotoğrafı:', this.userProfilePictureUrl);
      } else {
        console.log('Kullanıcı profil fotoğrafı veri formatı:', response);
      }
    }, error => {
      console.error('Kullanıcı profil fotoğrafı alma hatası:', error);
    });
  }

}
