import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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

declare var Chart: any; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, MenuComponent, AccountComponent, SearchBarComponent, CommonModule],
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


  chartData = [
    { label: 'Direct', colorClass: 'text-primary', iconClass: 'fas fa-circle' },
    { label: 'Social', colorClass: 'text-success', iconClass: 'fas fa-circle' },
    { label: 'denem', colorClass: 'text-info', iconClass: 'fas fa-circle' },
    { label: 'yeni', colorClass: 'text-black', iconClass: 'fas fa-circle' }
  ];
  constructor(private accountapiService: AccountApiService, private savingApiService: SavingApiService, private transactionApiService: TransactionApiService) { };


  ngOnInit() {
    this.GetUserBalance();
    this.SavedAmount();
    this.TransactionAmount();
    this.chart();
    
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
  chart() {

    // Set new default font family and font color to mimic Bootstrap's default styling
    Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    Chart.defaults.global.defaultFontColor = '#858796';

    // Pie Chart Example
    var ctx = document.getElementById("myPieChart");
    var myPieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ["Direct", "Referral", "denem", "yenideneme"],
        datasets: [{
          data: [15, 10, 45, 30],
          backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#3638cc' ],
          hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf', '#2c38af'],
          hoverBorderColor: "rgba(234, 236, 244, 1)",
        }],
      },
      options: {
        maintainAspectRatio: false,
        tooltips: {
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          borderColor: '#dddfeb',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          caretPadding: 10,
        },
        legend: {
          display: false
        },
        cutoutPercentage: 80,
      },
    });
  }
}
