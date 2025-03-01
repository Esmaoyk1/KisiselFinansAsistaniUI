import { Component } from '@angular/core';
import { ExportExcelService } from '../../../../services/export-excel.service';

@Component({
  selector: 'app-balance-report',
  standalone: true,
  imports: [],
  templateUrl: './balance-report.component.html',
  styleUrl: './balance-report.component.css'
})
export class BalanceReportComponent {
  constructor(
    private reportServis: ExportExcelService
  ) { };
  generateReport() {
    const exampleData = [
      { Ad: 'Ahmet', Soyad: 'Yılmaz', Yaş: 30 },
      { Ad: 'Mehmet', Soyad: 'Kaya', Yaş: 25 },
      { Ad: 'Ayşe', Soyad: 'Demir', Yaş: 28 }
    ];

    this.reportServis.exportToExcel(exampleData, 'Kullanıcılar');
  }
}
