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

import { HttpClientModule } from '@angular/common/http';

import { DovizKuruServisi } from './doviz-kuru-servisi';

declare var Chart: any; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, MenuComponent, AccountComponent, SearchBarComponent, CommonModule, HttpClientModule],
  providers: [AccountApiService, SavingApiService, TransactionApiService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  title = 'KisiselFinansAsistaniUI';
  userBalance: number = 12356; // Başlangıç değeri
  currency: string | undefined;
  savedAmount: number = 1500; // Başlangıç değeri
  transactionAmount: number = 4236; // Başlangıç değeri
  remainingBudget: number = 6500; // Başlangıç değeri
  percentageRemaining: number = 0;

  //PieChart değişkenleri
  //chartData: { label: any; colorClass: string; iconClass: string }[] = [];
  chartData: { label: any; colorClass: string; iconClass: string; color: string }[] = [];

  dataResp: number[] = [];
  datalabels: string[] = [];
  //colorClasses: string[] = ['text-danger', 'text-warning', 'text-success', 'text-secondary', 'text-primary'];
  chartColors: string[] = ['#dc3545', '#ffc107', '#28a745', '#0d6efd', '#6c757d'];
  hoverBackgroundColor: string[] = ['#c82333', '#e0a800', '#218838', '#1c7ed6', '#5a6268'];


  //chartData = [
  //  { label: 'Direct', colorClass: 'text-primary', iconClass: 'fas fa-circle' },
  //  { label: 'Social', colorClass: 'text-success', iconClass: 'fas fa-circle' },
  //  { label: 'denem', colorClass: 'text-info', iconClass: 'fas fa-circle' },
  //  { label: 'yeni', colorClass: 'text-black', iconClass: 'fas fa-circle' }
  //];

  //AreaChart  değişkenleri
  dataArea: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  constructor(private accountapiService: AccountApiService, private savingApiService: SavingApiService, private transactionApiService: TransactionApiService) { };

  //tasaruf değişkenleri

  dataFive: any[] = [];

  public url = 'https://www.tcmb.gov.tr/kurlar/today.xml';

  ngOnInit() {

    this.GetUserBalance();
    this.SavedAmount();
    this.TransactionAmount();

    this.calculatePercentageRemaining();
    this.getAreaChartByAccount();
    this.GetLastFiveByUser();

  }



  GetLastFiveByUser() {
    this.savingApiService.GetLastFiveByUser(1).subscribe(
      response => {
        console.log('five respo:', response);
        this.dataFive = response.data.items;

      },
      error => {
        console.error(' hata:', error);
        //alert(' hatası:');
      }
    );
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
        //alert(' hatası:');
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
        // alert(' hatası:');
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
        // alert(' hatası:');
      }

    )
  }


  KalanButce() {


    this.remainingBudget = this.userBalance - this.savedAmount - this.transactionAmount;

    // Kalan bütçeyi konsola yazdır
    console.log(this.userBalance + "Kalan bütçe: " + this.remainingBudget);
  }

  //getRandomColorClass(): string {
  //  // Rastgele bir renk sınıfı seçer
  //  const randomIndex = Math.floor(Math.random() * this.colorClasses.length);
  //  return this.colorClasses[randomIndex];
  //}
  calculatePercentageRemaining() {
    this.transactionApiService.GetTransactionPercentageByAccount(1).subscribe(
      response => {
        console.log("başardık ulan", response);

        this.chartData = response.data.items.map((item: any, index: number) => ({


          label: item.categoryName, // API'den gelen label
          //colorClass: this.getRandomColorClass() + index, // Rastgele bir renk sınıfı
          color: this.chartColors[index],
          iconClass: 'fas fa-circle', // Varsayılan ikon sınıfı
        }));
        this.datalabels = response.data.items.map((item: any) => item.categoryName),
          this.dataResp = response.data.items.map((item: any) => item.percentage),
          console.log(this.chartData); // Düzenlenmiş chartData
        console.log(this.dataResp); // Yüzde değerleri
        // console.log(this.dataResp);
        //this.chartData.a
        //  { label: 'Direct', colorClass: 'text-primary', iconClass: 'fas fa-circle' },
        //  response.data.items;
        this.KalanButce();
        this.pieChart();
      },
      error => {
        console.error(' hata:', error);
        // alert(' hatası:');
      }

    )
  }
  getAreaChartByAccount() {
    this.transactionApiService.GetTransactionAreaChartByAccount(1).subscribe(
      response => {
        console.log("Aylar", response);

        //const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);

        //// Verilerinizi eşleştirin ve eksik aylar için totalAmount'u 0 yapın
        //this.dataArea = allMonths.map((month) => {
        //  const foundItem = response.data.items.find((item: any) => item.month === month);
        //  return foundItem ? foundItem.totalAmount : 0; // Eğer bulanırsa totalAmount'u kullan, yoksa 0 bas
        //});
        this.dataArea = response.data.items.map((item: any) => item.totalAmount),

          console.log(this.dataArea);

        this.chartArea();
      },
      error => {
        console.error(' hata:', error);
        // alert(' hatası:');
      }

    )
  }
  pieChart() {

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
          backgroundColor: this.chartColors,
          _hoverBackgroundColor: this.hoverBackgroundColor,
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
  chartArea() {

    // Set new default font family and font color to mimic Bootstrap's default styling
    Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    Chart.defaults.global.defaultFontColor = '#858796';

    function number_format(number: number, decimals: number, dec_point: string, thousands_sep: string) {
      // *     example: number_format(1234.56, 2, ',', ' ');
      // *     return: '1 234,56'
      number = parseFloat((number + '').replace(',', '').replace(' ', '')); // Tür dönüşümü
      //number = (number + '').replace(',', '').replace(' ', '');
      var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s: string[] = [], // Dizi olarak tanımlandı.
        //s = '',
        toFixedFix = function (n: number, prec: number) {
          var k = Math.pow(10, prec);
          return '' + Math.round(n * k) / k;
        };
      // Fix for IE parseFloat(0.55).toFixed(0) = 0;
      s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
      if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
      }
      if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
      }
      return s.join(dec);
    }

    // Area Chart Example
    var ctx = document.getElementById("myAreaChart");
    var myLineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
        datasets: [{
          label: "Harcamalar ",
          lineTension: 0.3,
          backgroundColor: "rgba(78, 115, 223, 0.05)",
          borderColor: "rgba(78, 115, 223, 1)",
          pointRadius: 3,
          pointBackgroundColor: "rgba(78, 115, 223, 1)",
          pointBorderColor: "rgba(78, 115, 223, 1)",
          pointHoverRadius: 3,
          pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
          pointHoverBorderColor: "rgba(78, 115, 223, 1)",
          pointHitRadius: 10,
          pointBorderWidth: 2,
          data: this.dataArea,
          //data: [0, 10000, 5000, 15000, 10000, 20000, 15000, 25000, 20000, 30000, 25000, 40000],
        }],
      },
      options: {
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 10,
            right: 25,
            top: 25,
            bottom: 0
          }
        },
        scales: {
          xAxes: [{
            time: {
              unit: 'date'
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            ticks: {
              maxTicksLimit: 7
            }
          }],
          yAxes: [{
            ticks: {
              maxTicksLimit: 5,
              padding: 10,
              // Include a dollar sign in the ticks
              callback: function (value: number, index: number, values: number[]) {
                return '₺' + number_format(value, 2, '.', ',');
              }
            },
            gridLines: {
              color: "rgb(234, 236, 244)",
              zeroLineColor: "rgb(234, 236, 244)",
              drawBorder: false,
              borderDash: [2],
              zeroLineBorderDash: [2]
            }
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          titleMarginBottom: 10,
          titleFontColor: '#6e707e',
          titleFontSize: 14,
          borderColor: '#dddfeb',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          intersect: false,
          mode: 'index',
          caretPadding: 10,
          callbacks: {
            label: function (tooltipItem: any, chart: any) {
              var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
              return datasetLabel + ': ₺' + number_format(tooltipItem.yLabel, 2, '.', ',');


            }
          }
        }
      }
    });
  }



  calculatePercentage(savedAmount: number, goalAmount: number): string {
    if (goalAmount === 0) return '0%';  // Avoid division by zero
    const percentage = (savedAmount / goalAmount) * 100;
    return `${percentage.toFixed(2)}%`;
  }

  //calculateProgressBarWidth(savedAmount: number, goalAmount: number): string {
  //  const percentage = this.calculatePercentage(savedAmount, goalAmount);
  //  return percentage + '%';
  //}

  calculateProgressBarWidth(savedAmount: number, goalAmount: number): number {
    if (goalAmount === 0) return 0; // Hedef tutar sıfır ise yüzde 0 döndür
    return (savedAmount / goalAmount) * 100;
  }

  getProgressBarClass(index: number): string {
    const classes = ['bg-danger', 'bg-warning', 'bg-primary', 'bg-info', 'bg-success'];
    return classes[index % classes.length];
  }


  private parseXml(xml: string) {
    // DOMParser ile XML'i parse ediyoruz
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'application/xml');

    const dolarElement = xmlDoc.querySelector('Currency [CurrencyCode="USD"]');
    const euroElement = xmlDoc.querySelector('Currency [CurrencyCode="EUR"]');

    const dolarKuru = parseFloat(dolarElement?.querySelector('BanknoteSelling')?.textContent || '0');
    const euroKuru = parseFloat(euroElement?.querySelector('BanknoteSelling')?.textContent || '0');

    return { dolarKuru, euroKuru };
  }
}
