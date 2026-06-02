import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { MatDialog } from '@angular/material/dialog';
import { EditQualificationsDialogComponent } from '../edit-qualifications-dialog/edit-qualifications-dialog.component';

@Component({
  selector: 'app-qualifications-button-cell',
  template: `
    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
      <button style="font-size: 12px; padding: 2px 6px; background-color: #eee; border: 1px solid #ccc; border-radius: 3px; margin-left: 6px;"
              (click)="openDialog()" title="Edit Qualifications">
        ...
      </button>
      <span style="max-width: 85%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-style: italic; font-size: 13px; color: #444;">
        {{ preview || 'Click to add qualifications' }}
      </span>
    </div>
  `
})
export class QualificationsButtonCellComponent implements ICellRendererAngularComp {
  params: any;
  preview: string = '';

  constructor(private dialog: MatDialog) {}

  agInit(params: any): void {
    this.params = params;
    this.updatePreview(params.value);
  }

  refresh(params: any): boolean {
    this.params = params;
    this.updatePreview(params.value);
    return true;
  }

  updatePreview(jsonString: string): void {
    if (!jsonString) {
      this.preview = '';
      return;
    }

    try {
      const parsed = JSON.parse(jsonString);
      const count = Object.keys(parsed).length;
      if (count === 0) {
        this.preview = '';
      } else if (count === 1) {
        this.preview = '1 qualification';
      } else {
        this.preview = `${count} qualifications`;
      }
    } catch (e) {
      this.preview = 'Invalid JSON';
    }
  }

  openDialog(): void {
    const selected = this.params.data?.['selected']?.toLowerCase();
    if (selected !== 'yes') {
      alert('Please mark this row as selected (select = yes) before editing.');
      return;
    }

    const dialogRef = this.dialog.open(EditQualificationsDialogComponent, {
      width: '700px',
      data: {
        currentValue: this.params.value || '',
        jobId: this.params.data['job_id'],
        node: this.params.node
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.updatePreview(result);
      }
    });
  }
}
