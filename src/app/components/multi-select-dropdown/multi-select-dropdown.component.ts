import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { GenericDataService } from 'src/app/services/generic-data.service';

@Component({
  selector: 'app-multi-select-dropdown',
  templateUrl: './multi-select-dropdown.component.html',
  styleUrls: ['./multi-select-dropdown.component.css']
})
export class MultiSelectDropdownComponent implements ICellEditorAngularComp, OnInit {

  @Input() procName: string; // Stored procedure name
  @Output() valuesChange = new EventEmitter<any[]>(); // Emit changes

  public selectedValues: string[] = [];
  // The list of options for the multi-select
  public options: any;
  public params: any;


  constructor(private http: HttpClient, protected dataService: GenericDataService) {}

  agInit(params:any): void {
    this.params = params;
    this.procName = this.params.procName
    this.selectedValues = params.value || [];
    this.options =  [];
    this.fetchOptions();
  }

  ngOnInit(): void {
    // this.fetchOptions();
  }

  getValue(): any {
    return this.selectedValues;
  }

  fetchOptions(): void {
    this.dataService.fetchData('get_options', null, { sp_name: this.procName  }).subscribe(data => {
      this.options = data;
    });

  }

  // onSelectionChange(option: any, event: any): void {
  //   const selected = event.target.checked;
  //   this.saveSelectedValues(option.Code, selected);
  // }

  onSelectionChange(option: any, event: any) {
    const selectedOptions = event.value;
    this.options.forEach(option => {
      option.Selected = selectedOptions.includes(option);
    });
  }

  saveSelectedValues(code: string, selected: boolean): void {
    this.dataService.fetchDataPost('/api/saveSelectedValues', null, { code: code,selected: selected, sp_name: this.procName}).subscribe(data => {
    });
  }
}
