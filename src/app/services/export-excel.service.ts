import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {

  constructor() { }

   exportToExcel(jsonData: any[], fileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook: XLSX.WorkBook = { Sheets: { 'Data': worksheet }, SheetNames: ['Data'] };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const data: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `${fileName}.xlsx`);
  }

  async generatePDFReport(jsonData: any[]/*, fileName: string*/) {
    const exampleData = jsonData;

    const doc = new jsPDF();
    const fontUrl = 'assets/fonts/Roboto-Regular.ttf';  // Font dosyanızın yolu
    const fontData = await fetch(fontUrl).then(res => res.arrayBuffer());
    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(fontData); // arrayBuffer yerine değişkenin adını yaz

    doc.addFileToVFS('Roboto-Regular.ttf', text);
    doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
    doc.setFont('Roboto');
    const tableColumn = ['User ID', 'Name', 'Surname', 'Email', 'Total Balance'];
    const tableRows: any[] = [];

    //exampleData.forEach(item => {
    //  tableRows.push([item.Ad, item.Soyad, item.Yaş]);
    //});
    jsonData.forEach(item => {
      tableRows.push([item.ID, item.Ad, item.Soyad, item.Email, item.ToplamBakiye]);
    });
    // **Eğer hata alıyorsan, aşağıdaki satırı dene**
    // (Bu, bazı sürümlerde gereklidir)
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows
    });

    doc.save('Kullanıcılar_Raporu.pdf');
  }

 
  
}


