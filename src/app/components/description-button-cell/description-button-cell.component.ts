import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { MatDialog } from '@angular/material/dialog';
import { EditDescriptionDialogComponent } from '../edit-description-dialog/edit-description-dialog.component';

@Component({
  selector: 'app-description-button-cell',
  template: `
    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
      <button style="font-size: 12px; padding: 2px 6px; background-color: #eee; border: 1px solid #ccc; border-radius: 3px; margin-left: 6px;"
              (click)="openDialog()" title="Edit Description">
        …
      </button>
      <span style="max-width: 85%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-style: italic; font-size: 13px; color: #444;">
        {{ preview || 'Click to add description' }}
      </span>
    </div>
  `
})
export class DescriptionButtonCellComponent implements ICellRendererAngularComp {
  params: any;
  preview: string = '';

  constructor(private dialog: MatDialog) {}

  agInit(params: any): void {
    this.params = params;

    const html = params.value || '';
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    this.preview = text.length > 80 ? text.slice(0, 80) + '…' : text;
  }

  refresh(): boolean {
    return false;
  }

  openDialog() {
    const selected = this.params.data?.['selected']?.toLowerCase();
    if (selected !== 'yes') {
      alert('Please mark this row as selected (select = yes) before editing.');
      return;
    }

    this.dialog.open(EditDescriptionDialogComponent, {
      width: '600px',
      data: {
        currentValue: this.params.value || '',
        jobId: this.params.data['job_id'],
        node: this.params.node
      }
    });
  }
}
