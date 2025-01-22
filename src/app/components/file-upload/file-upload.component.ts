import { Component, Output,Input, EventEmitter } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  @Output() csvParsed = new EventEmitter<any>(); // Emit parsed JSON to the parent
  @Input() buttonLabel: string = 'Upload File'; // Default value if parent doesn't pass anything

  // Trigger file input dialog
  triggerFileInput(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  // Handle file selection and parse CSV
  uploadFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const binaryData = e.target?.result;
        if (binaryData) {
          const workbook = XLSX.read(binaryData, { type: 'binary' });
          const sheetName = workbook.SheetNames[0]; // Get the first sheet
          const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]); // Convert sheet to JSON
          // const result = {
          //   source: 'file-upload', // Add a default source
          //   jobs: sheetData
          // };
          this.csvParsed.emit(sheetData); // Emit the parsed JSON to the parent
        }
      };

      reader.readAsBinaryString(file); // Read the file as binary
    }
  }
}
