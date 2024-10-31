import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './app-message-dialog.component.html'
})
export class MessageDialogComponent {
  public message: string;

  constructor(public dialogRef: MatDialogRef<MessageDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onOk(): void {
    this.dialogRef.close({ message: this.message });
  }
}
