import { Component, Renderer2 } from '@angular/core';
import { TransactionApiService } from '../../../../services/transactionapi.service';
import { ExportExcelService } from '../../../../services/export-excel.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expense-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expense-report.component.html',
  styleUrl: './expense-report.component.css'
})
export class ExpenseReportComponent {
  amount: number = 0;

  users: any[] = [];
  constructor(
    private reportServis: ExportExcelService,
    private transactionApiService: TransactionApiService,
    private renderer: Renderer2,
  ) { };

  async ngOnInit() {

    this.GetUserTransactionReport();
  }

  generateReportExcel() {
    const exampleData = this.users.map(user => ({
      ID: user.userId,
      Ad: user.name,
      Soyad: user.surname,
      Email: user.email,
      HarcananButce: user.expenceAmount 

    }));

    this.reportServis.exportToExcel(exampleData, 'HarcamaTablosu');
  }

  GetUserTransactionReport(): void {
    this.transactionApiService.UserTransactionReport().subscribe(
      response => {
        this.users = response.data.items.map((user: {
          userId: number;
          name: string;
          surname: string;
          email: string;
          expenceAmount: number;
        }) => ({
          ...user,
          total: user.expenceAmount 
        }));

        this.users.sort((a, b) => b.total - a.total);
        this.users = [...this.users];
        console.log("Sıralanmış Kullanıcı Verileri:", this.users);
        //this.loadDataTabl2e();
        this.loadScriptsSequentially();
        this.loadCss('assets/vendor/datatables/dataTables.bootstrap4.min.css');
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
      HarcananButce: user.expenceAmount 
    }));
    this.reportServis.generatePDFReport(exampleData, "Harcama Raporu", "Harcama Raporu");
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
