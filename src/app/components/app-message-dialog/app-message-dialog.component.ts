import { Component,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-message-dialog',
  templateUrl: './app-message-dialog.component.html'
})
export class MessageDialogComponent {
  message: string;

  constructor(
    public dialogRef: MatDialogRef<MessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string , sendLabel: string }
  ) {
    this.message = data.message;  // Initialize the message with the passed data
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onOk(): void {
    this.dialogRef.close(this.message);  // Return the message when the dialog is closed
  }
}