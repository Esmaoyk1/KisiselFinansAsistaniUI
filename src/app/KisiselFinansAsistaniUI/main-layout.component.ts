import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { SavingApiService } from '../services/saving.service';
import { CommonModule } from '@angular/common';
import { TransactionApiService } from '../services/transactionapi.service';
//import { HttpClient } from '@angular/common/http';
//import { AuthService } from '../Auth/auth-service.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  templateUrl: './main-layout.component.html',
  imports: [RouterOutlet, MenuComponent, SearchBarComponent, CommonModule],
})
export class MainLayoutComponent implements OnInit {
  hedefler: any[] = [];
  categories: any[] = [];

  constructor(private savingApiService: SavingApiService , private transactionApiService: TransactionApiService) { }


  ngOnInit() {
    this.getHighSavingsByUser(1); // Örnek olarak 1 kullanıcı ID'si kullanıldı
    this.getTransactionPercentageByAccount(1);

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

}
