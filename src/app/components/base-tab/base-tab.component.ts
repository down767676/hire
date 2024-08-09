import { Component, OnInit, ViewChild, Input, Inject } from '@angular/core';
import { GenericDataService } from 'src/app/services/generic-data.service';
import { DynamicGridComponent } from '../../dynamic-grid/dynamic-grid.component';
import { PopupService } from '../../services/popup.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ParamService } from 'src/app/services/param-service.service';
import { BASE_CLASS_PARAMS } from './base-tab.tokens'; // Adjust the path as necessary

@Component({
  selector: 'app-base-tab',
  templateUrl: './base-tab.component.html',
  styleUrls: ['./base-tab.component.css']
})
export class BaseTabComponent implements OnInit {
  @ViewChild(DynamicGridComponent) agGrid: DynamicGridComponent;
  selectedRows = []
  selectedOptions = []
  searchFields = []
  rowData: any[] = [];
  columnDefs = [
    { field: 'make' },
    { field: 'model' },
    { field: 'price' }];


  table_name: string;
  api_end_point: string;
  sp: string;
  display_on_load: boolean;

  protected showPleaseWaitCursor:boolean = false;

  
  showWait():void{
    this.showPleaseWaitCursor = true;
  }

  hideWait():void{
    this.showPleaseWaitCursor = false;
  }


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, protected paramService: ParamService, protected dataService: GenericDataService, protected popupService: PopupService, @Inject(BASE_CLASS_PARAMS) params:any) 
  {
    this.api_end_point = params['api_end_point'];
    this.sp = params['sp'];
    this.table_name = params['table_name'];
    this.display_on_load = params['display_on_load'];

   }

  extractCheckedIDs(id): any {
    let data = this.getCheckedRows();
    return this.extractIds(id);
  }


  getCheckedRows(): any {
    this.selectedRows = this.agGrid.api.getSelectedNodes()
      .filter(node => node.isSelected())
      .map(node => node.data);
    console.log('Checked Rows:', this.selectedRows);
    return this.selectedRows
  }

  extractIds(id): any {
    const jobIdsArray = this.selectedRows.map(row => row[id]);
    // const jsonJobIds = JSON.stringify(jobIdsArray);
    console.log('JSON Job IDs:', jobIdsArray);
    return jobIdsArray;
  }

  setParentAttributes(params: any): void {

    this.api_end_point = params['api_end_point'];
    this.sp = params['sp'];
    this.table_name = params['table_name'];
    this.display_on_load = params['display_on_load'];
  }

  // setDynamicGridAttributes(apiEndPoint: string, sp: string, tableName: string, displayOnLoad: boolean): void {
  //   this.agGrid.setAttributes({"api_end_piint":apiEndPoint, "sp":sp, "table_name":this.table_name, "display_on_load":displayOnLoad})
  //   this.paramService.setApiEndPoint(apiEndPoint);
  //   this.paramService.setSp(sp);
  //   this.paramService.setTableName(tableName);
  //   this.paramService.setDisplayOnLoad(displayOnLoad);
  // }


  // abstract someMethod(): void;

  ngOnInit(): void {
    // this.initializeFields()
  }


  ngAfterViewInit(): void {
    // this.initializeFields();
    // if (this.display_on_load)
    // {
    //   this.agGrid.loadGridColAndRows(this.data)
    // }
  }

  initializeFields(): void {
  }

  search(): void {
    const params = this.buildSearchParams();
    this.dataService.fetchData(this.api_end_point, this.sp, params).subscribe(data => {
      this.rowData = data;
    });
  }

  searchAndOpenPopup(api_end_point, sp, params, component): void {
    // const params = this.buildSearchParams();
    this.dataService.fetchDataPost(api_end_point, sp, params).subscribe(data => {
      this.popupService.openPopup(component, data);
    });
  }

  buildSearchParams(): any {
    const params: any = {};
    this.searchFields.forEach((field, index) => {
      params[field] = this.selectedOptions[index];
    });
    return params;
  }

  openPopup(component: any, data: any): void {
    this.popupService.openPopup(component, data);
  }

  sendEmail(): void {
    // Add additional logic for sending email
    console.log('Base Class email logic');
  }

  sendText(): void {
    // Add additional logic for sending text
    console.log('Base Class text logic');
  }
}
