import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-description-dialog',
  templateUrl: './edit-description-dialog.component.html'
})
export class EditDescriptionDialogComponent {
  editedValue: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditDescriptionDialogComponent>,
    private http: HttpClient
  ) {
    this.editedValue = data.currentValue;
  }

  save() {
    const payload = {
      table: 'job',
      column: 'description',
      content: this.editedValue,
      key: this.data.jobId
    };

    this.http.post('/update', payload).subscribe({
      next: () => {
        this.data.node.setDataValue('description', this.editedValue);
        this.dialogRef.close();
      },
      error: () => alert('Update failed')
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
