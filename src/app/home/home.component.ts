import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs'; // Observable kullanacağız

import { HttpClient } from '@angular/common/http';
import { MenuComponent } from '../menu/menu.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { AccountComponent } from '../KisiselFinansAsistaniUI/account/account.component';
import { AccountApiService } from '../services/account-api.service';
import { response } from 'express';
import { SavingApiService } from '../services/saving.service';
import { TransactionApiService } from '../services/transactionapi.service';
import { parse } from 'node:path/posix';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, MenuComponent, AccountComponent, SearchBarComponent],
  providers: [AccountApiService, SavingApiService, TransactionApiService ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  title = 'KisiselFinansAsistaniUI';
  userBalance: number = 0; // Başlangıç değeri
  currency: string | undefined;
  savedAmount: number = 0; // Başlangıç değeri
  transactionAmount: number = 0; // Başlangıç değeri
  remainingBudget: number = 0; // Başlangıç değeri


  constructor(private accountapiService: AccountApiService, private savingApiService: SavingApiService, private transactionApiService: TransactionApiService) { };


  ngOnInit() {
    this.GetUserBalance();
    this.SavedAmount();
    this.TransactionAmount();
  
    
  }

  GetUserBalance() {
    this.accountapiService.getUserAccountBalance(1).subscribe(
      response => {
        console.log('başarılı:', response);
        this.userBalance = response.data.balance;
        this.currency = response.data.currency;
        this.KalanButce();
      },
      error => {
        console.error(' hata:', error);
        alert(' hatası:');
      }
    );
  }


  SavedAmount() {
    this.savingApiService.getSavedAmount(1).subscribe(
      response => {
        console.log("başarılı", response);
        this.savedAmount = response.data.savedAmount;
        this.KalanButce();
    
      },
      error => {
        console.error(' hata:', error);
        alert(' hatası:');
      }
    )
  }


  TransactionAmount() {
    this.transactionApiService.getTransactionAmount(1).subscribe(
      response => {
        console.log("başarılı", response);
        this.transactionAmount = response.data.transactionAmount;
           this.KalanButce();

      },
      error => {
        console.error(' hata:', error);
        alert(' hatası:');
      }

    )
  }


  KalanButce() {
    

    this.remainingBudget = this.userBalance - this.savedAmount - this.transactionAmount;

    // Kalan bütçeyi konsola yazdır
    console.log(this.userBalance+"Kalan bütçe: " + this.remainingBudget);
  }

}
