import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface EmailMessage {
  from: string;
  to: string;
  subject: string;
  body: string;
}

@Component({
  selector: 'app-email-message-dialog',
  templateUrl: './app-email-message-dialog.component.html'
})
export class EmailMessageDialogComponent {
  email: EmailMessage;
  public sendLabel: string;

constructor(
  public dialogRef: MatDialogRef<EmailMessageDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: { email: EmailMessage; sendLabel: string }
) {
  this.email = { ...data.email };
  this.sendLabel = data.sendLabel;
}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSend(): void {
    this.dialogRef.close(this.email);
  }
}
