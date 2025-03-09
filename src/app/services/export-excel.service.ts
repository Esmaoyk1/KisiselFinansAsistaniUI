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

  async generatePDFReport(jsonData: any[], fileName: string, fileHedaer: string) {
    const exampleData = jsonData;
    console.log(exampleData);
    const doc = new jsPDF();
    doc.text(fileHedaer, 14, 15);
    const fontUrl = '/assets/fonts/Roboto-Regular.ttf';  // Font dosyanızın yolu
    const fontData = await fetch(fontUrl).then(res => res.arrayBuffer());
    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(fontData); // arrayBuffer yerine değişkenin adını yaz

    doc.addFileToVFS('Roboto-Regular.ttf', text);
    //doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
    doc.setFont('Roboto');
    //const tableColumn = ['User ID', 'Name', 'Surname', 'Email', 'Total Balance'];
    const tableColumn = exampleData.length > 0 ? Object.keys(exampleData[0]) : [];

    //const tableRows: any[] = [];

    //exampleData.forEach(item => {
    //  tableRows.push([item.Ad, item.Soyad, item.Yaş]);
    //});
    // İlk nesnenin anahtarlarını al (hangi sütunların olduğunu belirler)
    const columns = Object.keys(jsonData[0]);

    // Tüm satırları oluştur
    const tableRows = jsonData.map(item => columns.map(key => item[key]));


    //jsonData.forEach(item => {
    //  tableRows.push([item.ID, item.Ad, item.Soyad, item.Email, item.ToplamBakiye]);
    //});
    // **Eğer hata alıyorsan, aşağıdaki satırı dene**
    // (Bu, bazı sürümlerde gereklidir)
    autoTable(doc, {
      startY: 25,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid', // Tablo için grid stili
      headStyles: {
        fillColor: [0, 123, 255], // Başlık hücrelerinin arka plan rengi
        textColor: [255, 255, 255], // Başlık metni rengi
        fontSize: 8,
        fontStyle: 'bold',
        halign: 'center', // Başlıkların ortalanması
      },
      bodyStyles: {
        fontSize: 7,
        halign: 'center', // Veri hücrelerini ortalamak
      },
      styles: {
        cellPadding: 3, // Hücre içi boşluk
        lineColor: [0, 0, 0], // Hücre kenarlıklarının rengi
        lineWidth: 0.1, // Hücre kenarlıklarının kalınlığı
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240], // Alternatif satırlar için arka plan rengi
      }
    });

    doc.save(fileName+'.pdf');
  }



}


