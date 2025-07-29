import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
@Injectable({
  providedIn: 'root'
})
export class DownloadSerivceService {

  data = [
    { name: 'John', age: 25, city: 'New York' },
    { name: 'Alice', age: 30, city: 'London' },
    { name: 'Bob', age: 22, city: 'Paris' },
  ];
  constructor() { }

    exportToExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Data': worksheet },
      SheetNames: ['Data'],
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Save to file
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, 'exported-data.xlsx');
}

  exportToCSV(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
    const csvData: string = XLSX.utils.sheet_to_csv(worksheet);

    const blob: Blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(blob, 'exported-data.csv');
  }

}