import { Component, ViewChild, ElementRef } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { MatDatepicker } from '@angular/material/datepicker';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

@Component({
  selector: 'app-material-date-editor',
  template: `
    <mat-form-field>
      <input
        #input
        matInput
        [matDatepicker]="picker"
        [(ngModel)]="value"
          (dateChange)="onDateChange($event)"
      />
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
    <mat-datepicker #picker panelClass="ag-custom-component-popup"></mat-datepicker>

    </mat-form-field>
  `,
})
export class MaterialDateEditorComponent implements ICellEditorAngularComp {
  public value: Date | null = null;
  public params: any;

  @ViewChild('picker') picker!: MatDatepicker<Date>;
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;

  agInit(params: any): void {
    this.params = params;
    this.value = params.value ? new Date(params.value) : null;
  }

  getValue(): Date | null {
    return this.value;
  } 

  isPopup(): boolean {
  return true;
}

onDateChange(event: MatDatepickerInputEvent<Date>): void {
  this.value = event.value;
  this.params.api.stopEditing();
}


  // afterGuiAttached(): void {
  //   setTimeout(() => {
  //     this.picker.open();
  //   });
  // }
}
