import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-hello-world-cell',
  template: `<span>Hello World</span>`
})
export class HelloWorldCellComponent implements ICellRendererAngularComp {
  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params: any): boolean {
    return false;
  }
}
