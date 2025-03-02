import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


//const pdfMake = require('pdfmake/build/pdfmake');
//const pdfFonts = require('pdfmake/build/vfs_fonts');

//pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;




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



  async generatePDFReport() {
    const exampleData = [
      { Ad: 'Ahmet', Soyad: 'Yılmaz', Yaş: 30 },
      { Ad: 'Mehmet', Soyad: 'Kaya', Yaş: 25 },
      { Ad: 'Ayşe', Soyad: 'Demir', Yaş: 28 }
    ];

    const doc = new jsPDF();
    const fontUrl = 'assets/fonts/Roboto-Regular.ttf';  // Font dosyanızın yolu
    const fontData = await fetch(fontUrl).then(res => res.arrayBuffer());
    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(fontData); // arrayBuffer yerine değişkenin adını yaz

    doc.addFileToVFS('Roboto-Regular.ttf', text);
    doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
    doc.setFont('Roboto');
    const tableColumn = ['Ad', 'Soyad', 'Yaş'];
    const tableRows: any[] = [];

    exampleData.forEach(item => {
      tableRows.push([item.Ad, item.Soyad, item.Yaş]);
    });

    // **Eğer hata alıyorsan, aşağıdaki satırı dene**
    // (Bu, bazı sürümlerde gereklidir)
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows
    });

    doc.save('Kullanıcılar_Raporu.pdf');
  }

  exportToPdf() {
  //  const documentDefinition = {
  //    content: [
  //      { text: 'Kullanıcı Listesi', style: 'header' },
  //      {
  //        table: {
  //          headerRows: 1,
  //          widths: ['*', '*', '*'],
  //          body: [
  //            ['Ad', 'Soyad', 'Yaş'],
  //            ['Ahmet', 'Yılmaz', '30'],
  //            ['Mehmet', 'Kaya', '25'],
  //            ['Ayşe', 'Demir', '28']
  //          ]
  //        }
  //      }
  //    ],
  //    styles: {
  //      header: {
  //        fontSize: 18,
  //        bold: true,
  //        margin: [0, 0, 0, 10]
  //      }
  //    }
  //  };

  //  pdfMake.createPdf(documentDefinition).download('Kullanıcılar.pdf');
  }
}
