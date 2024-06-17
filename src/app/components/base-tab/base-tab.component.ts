// src/app/components/base-tab/base-tab.component.ts
import { Component, OnInit } from '@angular/core';
import { GenericDataService } from 'src/app/services/generic-data.service';


@Component({
  selector: 'app-base-tab',
  template: '',
  styleUrls: ['./base-tab.component.css']
})
export class BaseTabComponent implements OnInit {
  searchFields: any[] = [];
  selectedOptions: any[] = [];
  rowData: any[] = [];
  columnDefs = [
    { field: 'make' },
    { field: 'model' },
    { field: 'price' }
  ];
  public api_end_point : string;
  public sp: string;
  public table_name:string;

  setParentAttributes(api_end_point, sp, table_name)
  {
    this.api_end_point = api_end_point;
    this.sp = sp;
    this.table_name = table_name;
  }
  constructor(private dataService: GenericDataService) { }

  ngOnInit(): void {
    this.initializeFields();
  }

  initializeFields(): void {
    // To be overridden by child components
  }

  search(): void {
    const params = this.buildSearchParams();
    this.dataService.fetchData( this.api_end_point, this.sp, params).subscribe(data => {
      this.rowData = data;
    });
  }

  buildSearchParams(): any {
    const params: any = {};
    this.searchFields.forEach((field, index) => {
      params[field] = this.selectedOptions[index];
    });
    return params;
  }
}
