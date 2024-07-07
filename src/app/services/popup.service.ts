import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(private dialog: MatDialog) { }

  openPopup<T>(component: any, data: any): void {
    this.dialog.open(component, {
      width: '100vw',  // Set dialog width to 100% of the viewport width
      height: '100vh', // Set dialog height to 100% of the viewport height
      maxWidth: '100vw', // Ensure max-width doesn't constrain the dialog
      panelClass: 'full-screen-dialog', // Apply custom class
      data: data
    });
  }
}
