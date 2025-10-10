import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-hello-test-cell',
  template: `<span>Hello Test</span>`
})
export class HelloTestCellComponent implements ICellRendererAngularComp {
  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params: any): boolean {
    return false;
  }
}
