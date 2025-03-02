import { Component, Renderer2 } from '@angular/core';
import { ExportExcelService } from '../../../../services/export-excel.service';
import { AccountApiService } from '../../../../services/account-api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-balance-report',
  standalone: true,
  imports: [CommonModule, RouterModule],
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

  users: any[] = []; // Kullanıcı verilerini tutmak için dizi
  constructor(
    private reportServis: ExportExcelService,
    private accountapiService: AccountApiService,
    private renderer: Renderer2,
  ) { };
  async ngOnInit() {
    this.GetUserTransactionReport();
    this.loadScriptsSequentially();
    this.loadCss('assets/vendor/datatables/dataTables.bootstrap4.min.css');
  }
  generateReportExcel() {
    const exampleData = this.users.map(user => ({
      ID: user.userId,
      Ad: user.name,
      Soyad: user.surname,
      Email: user.email,
      ToplamBakiye: user.totalBalance + user.totalAmount

    }));

    this.reportServis.exportToExcel(exampleData, 'Kullanıcılar');
  }

  GetUserTransactionReport(): void {
    this.accountapiService.getUserTransactionReport().subscribe(
      response => {
        this.users = response.data.items; // Cevap yapısının buna uygun olduğunu varsayıyoruz
        console.log("Kullanıcı Verileri:", this.users);
      },
      error => {
        console.error('Hata:', error);
      }
    );
  }

  generateReportPdf() {

    const exampleData = this.users.map(user => ({
      ID: user.userId,
      Ad: user.name,
      Soyad: user.surname,
      Email: user.email,
      ToplamBakiye: user.totalBalance + user.totalAmount

    }));
    this.reportServis.generatePDFReport(exampleData);
  }
  async loadScriptsSequentially() {
    try {
      await this.loadScript('assets/vendor/jquery/jquery.min.js');
      console.log('jQuery yüklendi.');
      await this.loadScript('assets/vendor/datatables/jquery.dataTables.min.js');
      console.log('DataTables JS yüklendi.');
      await this.loadScript('assets/vendor/datatables/dataTables.bootstrap4.min.js');
      console.log('Bootstrap DataTables yüklendi.');
      await this.loadScript('assets/js/demo/datatables-demo.js');
      console.log('Demo script yüklendi.');
      await this.loadScript('assets/js/test.js');
      console.log('Test script yüklendi.');
    } catch (error) {
      console.error(error);
    }
  }
  loadScript(scriptUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(`Script yüklenemedi: ${scriptUrl}`);
      document.body.appendChild(script);
    });
  }

  private loadCss(url: string) {
    const link = this.renderer.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    this.renderer.appendChild(document.head, link);
  }
}
