import { Component } from '@angular/core';
import { UserapiService } from '../../../services/user-api.service';
import { Chart, registerables } from 'chart.js';


Chart.register(...registerables);
@Component({
  selector: 'app-home-layout',
  standalone: true,
  imports: [],
  templateUrl: './home-layout.component.html',
  styleUrl: './home-layout.component.css'
})
export class HomeLayoutComponent {
  totalUsers: number = 0; // Toplam kullanıcı sayısı
  totalAdmins: number = 0; // Toplam admin sayısı
  totalRating: number = 0; // Toplam puan sayısı
  dataArea: number[] = []; // Kullanıcı sayısı verileri
  labels: string[] = []; // Tarih etiketleri


  constructor(private userService: UserapiService) { }

  ngOnInit(): void {
    console.log('ngOnInit çalıştı'); 
    this.getUsers(); // Kullanıcıları al
    this.getRating(); // Toplam puanı al
    this.getUserCountsByDate(); 
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
      response => {
        console.log('API Yanıtı:', response);

        if (response && Array.isArray(response)) {
          const today = new Date();
          const last30Days = Array.from({ length: 30 }, (_, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            return date.toISOString().split('T')[0]; // YYYY-MM-DD formatında tarih
          });

          const dailyCounts: { [key: string]: number } = {};

          response.forEach((item: any) => {
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

    const myLineChart = new Chart(ctx, {
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
}
