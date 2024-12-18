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
  providers: [AccountApiService, SavingApiService, TransactionApiService],
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
  percentageRemaining: number = 0;

  chartData: { label: any; colorClass: string; iconClass: string }[] = [];
  dataResp: number[] = [];
  datalabels: string[] = [];
  colorClasses: string[] = ['text-primary', 'text-success', 'text-info', 'text-black'];



  //chartData = [
  //  { label: 'Direct', colorClass: 'text-primary', iconClass: 'fas fa-circle' },
  //  { label: 'Social', colorClass: 'text-success', iconClass: 'fas fa-circle' },
  //  { label: 'denem', colorClass: 'text-info', iconClass: 'fas fa-circle' },
  //  { label: 'yeni', colorClass: 'text-black', iconClass: 'fas fa-circle' }
  //];
  constructor(private accountapiService: AccountApiService, private savingApiService: SavingApiService, private transactionApiService: TransactionApiService) { };


  ngOnInit() {

    this.GetUserBalance();
    this.SavedAmount();
    this.TransactionAmount();

    this.calculatePercentageRemaining();
   

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
    console.log(this.userBalance + "Kalan bütçe: " + this.remainingBudget);
  }

  getRandomColorClass(): string {
    // Rastgele bir renk sınıfı seçer
    const randomIndex = Math.floor(Math.random() * this.colorClasses.length);
    return this.colorClasses[randomIndex];
  }
  calculatePercentageRemaining() {
    this.transactionApiService.GetTransactionPercentageByAccount(1).subscribe(
      response => {
        console.log("başardık ulan", response);

        this.chartData = response.data.items.map((item: any) => ({
          label: item.categoryName, // API'den gelen label
          colorClass: this.getRandomColorClass(), // Rastgele bir renk sınıfı
          iconClass: 'fas fa-circle', // Varsayılan ikon sınıfı
        }));
        this.datalabels = response.data.items.map((item: any) => item.categoryName),
        this.dataResp = response.data.items.map((item: any) => item.percentage),
          console.log(this.dataResp);
        //this.chartData.a
        //  { label: 'Direct', colorClass: 'text-primary', iconClass: 'fas fa-circle' },
        //  response.data.items;
        this.KalanButce();
        this.chart();
      },
      error => {
        console.error(' hata:', error);
        alert(' hatası:');
      }

    )
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
        labels: this.datalabels,
        //labels: ["Direct", "Referral", "denem", "yenideneme"],
        datasets: [{
          data: this.dataResp,
          //data: [ 67.94871794871794,  6.410256410256411,  25.641025641025642  ],
          backgroundColor: ['#2FF3E0', '#F8D210', '#FA26A0', '#F51720', '#B0B0B0'],
          hoverBackgroundColor: ['#1ED4C2', '#E6C10F', '#D21A8A', '#D0101C', '#A0A0A0'],
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
