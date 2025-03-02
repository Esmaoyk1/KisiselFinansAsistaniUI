import { Component } from '@angular/core';
import { ExportExcelService } from '../../../../services/export-excel.service';
import { AccountApiService } from '../../../../services/account-api.service';

@Component({
  selector: 'app-balance-report',
  standalone: true,
  imports: [],
  templateUrl: './balance-report.component.html',
  styleUrl: './balance-report.component.css'
})
export class BalanceReportComponent {

  userBalance: number = 0; // Başlangıç değeri
  currency: string | undefined;
  savedAmount: number = 0; // Başlangıç değeri
  transactionAmount: number = 0; // Başlangıç değeri
  remainingBudget: number = 0; // Başlangıç değeri
  percentageRemaining: number = 0;
  totalTransactions: number = 0;
  constructor(
    private reportServis: ExportExcelService,
    private accountapiService: AccountApiService,
  ) { };
  generateReport() {
    const exampleData = [
      { Ad: 'Ahmet', Soyad: 'Yılmaz', Yaş: 30 },
      { Ad: 'Mehmet', Soyad: 'Kaya', Yaş: 25 },
      { Ad: 'Ayşe', Soyad: 'Demir', Yaş: 28 }
    ];

    this.reportServis.exportToExcel(exampleData, 'Kullanıcılar');
  }

  GetUserBalance(): void {
    this.accountapiService.getUserAccountBalance().subscribe(
      response => {
        this.userBalance = response.data.balance;
        this.currency = response.data.currency;
        console.log("Kullanıcı Bakiyesi (Banka): " + this.userBalance);
        this.KalanButce();
      },
      error => {
        console.error('Hata:', error);
      }
    );
  }

  GetUserBalanceWithTotal(): void {
    this.accountapiService.getUserAccountBalance().subscribe(
      response => {
        this.userBalance = response.data.balance + this.totalTransactions; // Toplam işlemleri ekle
        this.currency = response.data.currency;
        console.log("Kasadaki Toplam Değer: " + this.userBalance);
        this.KalanButce();
      },
      error => {
        console.error('Hata:', error);
      }
    );
  }

  KalanButce() {
    this.remainingBudget = this.userBalance - this.savedAmount - this.transactionAmount;
  }

}
