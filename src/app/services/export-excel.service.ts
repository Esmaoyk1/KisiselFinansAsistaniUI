import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


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
