import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../../menu/menu.component';
import { AccountApiService } from '../../services/account-api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [RouterModule, MenuComponent, FormsModule, CommonModule],
  providers: [AccountApiService],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  userbalance: any;
  account = {
    accountName: '',
    accountType: '',
    balance: 0,
    createdDate: '',
    currency: 'TL',
    status: true 
  };

 
  accounts: { accountName: string, accountType: string, balance: number }[] = [];
  accountName: string = '';
  accountType: string = '';
  balance: number = 0;


  constructor(private accountapiService: AccountApiService) { };


  ngOnInit() {
    this.GetUserBalance();
    this.accountGet();
  }
  GetUserBalance() {
    this.accountapiService.getUserAccountBalance(1).subscribe(
      response => {
        console.log('başarılı:', response);
        this.userbalance = parseFloat(response.data.balance).toFixed(2);  

      },
      error => {
        console.error(' hata:', error);
        alert(' hatası:' + error.message);
      }
    );
  }

  onSubmit() {
    this.accountapiService.createPost(this.account).subscribe(
      response => {
        console.log('Hesap başarıyla eklendi:', response);
        // Formu temizle
        this.account = { accountName: '', accountType: '', balance: 0, createdDate: '', currency: 'TL', status :true};
        this.GetUserBalance(); // Güncel bakiye bilgilerini al
      },
      error => {
        console.error('Hata:', error);
        alert('Hata oluştu: ' + error.message);
      }
    );
  }

  accountGet() {
    this.accountapiService.getPosts().subscribe(
      response => {
        console.log('Hesap verileri başarıyla alındı:', response);

        // response.data'nın dizide olup olmadığını kontrol et
        if (Array.isArray(response.data)) {
          this.accounts = response.data.items; // Hesapları dizi olarak al
        } else {
          // Eğer nesne ise, diziyi oluştur
          this.accounts = Object.values(response.data.items);
        }

        console.log('Alınan hesaplar:', this.accounts);
      },
      error => {
        console.error('Hesap verileri alınırken hata oluştu:', error);
        alert('Hata oluştu: ' + error.message);
      }
    );
  }
  
}



