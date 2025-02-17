import { Component } from '@angular/core';
import { UserapiService } from '../../../services/user-api.service';
import { Chart as areaChart, registerables } from 'chart.js';
import { TransactionApiService } from '../../../services/transactionapi.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';


declare var Chart: any;      //yuvarlak olan
areaChart.register(...registerables);
@Component({
  selector: 'app-home-layout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-layout.component.html',
  styleUrl: './home-layout.component.css'
})
export class HomeLayoutComponent {
  totalUsers: number = 0; // Toplam kullanıcı sayısı
  totalAdmins: number = 0; // Toplam admin sayısı
  totalRating: number = 0; // Toplam puan sayısı
  dataArea: number[] = []; // Kullanıcı sayısı verileri
  labels: string[] = []; // Tarih etiketleri

  /** **** Pie chart yuvarlak olan   *************** */

  chartData: { label: any; colorClass: string; iconClass: string; color: string }[] = []
  datalabels: string[] = [];
  chartColors: string[] = ['#dc3545', '#ffc107', '#28a745', '#0d6efd', '#6c757d'];
  noDataMessageVisible: boolean = false;//yıllık grafik verisi yoksa divi gizlemek için
  dataResp: number[] = [];
  hoverBackgroundColor: string[] = ['#c82333', '#e0a800', '#218838', '#1c7ed6', '#5a6268'];
  /** **** Pie chart yuvarlak olan   *************** */

  public url = 'http://localhost:5177/api/Exchange/exchange-rates';
  dolarKuru: number = 0;
  euroKuru: number = 0;
  sterlinKuru: number = 0;
  frangKuru: number = 0;
  constructor(private userService: UserapiService,
    private transactionApiService: TransactionApiService,
    private http: HttpClient) { }

  ngOnInit(): void {
    console.log('ngOnInit çalıştı'); 
    this.getUsers(); // Kullanıcıları al
    this.getRating(); // Toplam puanı al
    this.getUserCountsByDate();
    this.calculatePieChart();
    this.getKurlaar();
  }


  getUsers(): void {
    this.userService.getUsers().subscribe(
      response => {
        // Eğer yanıt beklenen yapıda ise
        if (response && response.adminUsers && response.regularUsers) {
          this.totalUsers = response.adminUsers.length + response.regularUsers.length;
          this.totalAdmins = response.adminUsers.length;

          console.log("Toplam Kullanıcı Sayısı:", this.totalUsers);
          console.log("Toplam Admin Sayısı:", this.totalAdmins);
        } else {
          console.error('Beklenmeyen yanıt yapısı:', response);
        }
      },
      error => {
        console.error('Hata:', error);
      }
    );
  }

  getRating(): void {
    this.userService.getRating().subscribe(
      response => {
        if (response && response.success) {
          this.totalRating = response.data.rating;
          console.log("Toplam Puan Sayısı:", this.totalRating);
        } else {
          console.error('Puan alınamadı:', response);
        }
      },
      error => {
        console.error('Hata:', error);
      }
    );
  }


  getUserCountsByDate() {
    this.userService.getUserCountsByDate().subscribe(
      (response : any) => {
        console.log('API Yanıtı:', response);

        if (response && response.success && response.data && Array.isArray(response.data.item)) {
          const today = new Date();
          const last30Days = Array.from({ length: 30 }, (_, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            return date.toISOString().split('T')[0]; // YYYY-MM-DD formatında tarih
          });

          const dailyCounts: { [key: string]: number } = {};
          //const rep2 = response.data.item;


          response.data.item.forEach((item: { date: string; count: number }) => {
            const dateKey = item.date.split('T')[0]; // Sadece tarih kısmını al
            dailyCounts[dateKey] = item.count; // Kullanıcı sayısını ata
          });

          // Grafik için etiketler ve veriler oluşturma
          last30Days.forEach(date => {
            this.labels.push(date);
            this.dataArea.push(dailyCounts[date] || 0); // Eğer yoksa 0 ata
          });

          console.log('Labels:', this.labels); // Kontrol edin
          console.log('Data:', this.dataArea); // Kontrol edin

          this.chartArea(this.labels, this.dataArea); // Grafiği çiz
        } else {
          console.error('Beklenen formatta veri alınamadı:', response);
        }
      },
      error => {
        console.error('Hata aldı:', error);
      }
    );
  }

  chartArea(labels: string[], data: number[]) {
    const ctx = document.getElementById("myAreaChart") as HTMLCanvasElement | null;

    if (!ctx) {
      console.error("Chart için gerekli canvas elementi bulunamadı!");
      return;
    }

    const myLineChart = new areaChart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: "Son 30 Gün Kullanıcı Sayısı",
          tension: 0.3,
          backgroundColor: "rgba(78, 115, 223, 0.05)",
          borderColor: "rgba(78, 115, 223, 1)",
          pointRadius: 3,
          pointBackgroundColor: "rgba(78, 115, 223, 1)",
          pointBorderColor: "rgba(78, 115, 223, 1)",
          data: data,
        }],
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          tooltip: {
            enabled: true,
          },
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Son 30 Günde Eklenen Kullanıcı Sayısı'
          }
        }
      }
    });
  }
  // pieChart yuvarlak olan
  calculatePieChart() {//yuvaklak oaln
    //Bu metod : Kategorilere gore yıllık harcama grafiği.
    this.transactionApiService.GetTransactionPercentageByAccount(1).subscribe(
      response => {
        if (!response.data.items || response.data.items.length === 0) {
          // Burada kullanıcıya bir mesaj gösterebilirsiniz
          this.chartData = [];
          this.noDataMessageVisible = true; // Bu değişkeni HTML'de kontrol edin
          return;
        }


        this.chartData = response.data.items.map((item: any, index: number) => ({


          label: item.categoryName, // API'den gelen label
          //colorClass: this.getRandomColorClass() + index, // Rastgele bir renk sınıfı
          color: this.chartColors[index],
          iconClass: 'fas fa-circle', // Varsayılan ikon sınıfı
        }));
        this.datalabels = response.data.items.map((item: any) => item.categoryName),
          this.dataResp = response.data.items.map((item: any) => item.percentage),
        this.pieChart();
      },
      error => {
        console.error(' hata:', error);
        // alert(' hatası:');
      }

    )
  }
  pieChart() {//yuvarlak olan

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


  private parseXml(xml: string) {
    // DOMParser ile XML'i parse ediyoruz
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'application/xml');

    const dolarElement = xmlDoc.querySelector('Currency[CurrencyCode="USD"] ');
    const euroElement = xmlDoc.querySelector('Currency[CurrencyCode="EUR"]');
    const sterlinElement = xmlDoc.querySelector('Currency[CurrencyCode="GBP"]');
    const frangElement = xmlDoc.querySelector('Currency[CurrencyCode="CHF"]');


    const dolarKuru = parseFloat(dolarElement?.querySelector('BanknoteSelling')?.textContent || '0');
    const euroKuru = parseFloat(euroElement?.querySelector('BanknoteSelling')?.textContent || '0');
    const sterlinKuru = parseFloat(sterlinElement?.querySelector('BanknoteSelling')?.textContent || '0');
    const frangKuru = parseFloat(frangElement?.querySelector('BanknoteSelling')?.textContent || '0');


    return { dolarKuru, euroKuru, sterlinKuru, frangKuru };
  }
  getDovizKurlari(): Observable<any> {
    return this.http.get(this.url, { responseType: 'text' }).pipe(map((response: string) => {
      //console.log('TCMB Response:', response); // Gelen XML verisi konsola yazdırılır
      return this.parseXml(response);
    }));
  }
  getKurlaar(): void {

    this.getDovizKurlari().subscribe(data => {
      this.dolarKuru = data.dolarKuru;
      this.euroKuru = data.euroKuru;
      this.sterlinKuru = data.sterlinKuru;
      this.frangKuru = data.frangKuru;
    });

  }

}
