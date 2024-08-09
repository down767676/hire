import { Component, Input, Inject } from '@angular/core';
import { BaseTabComponent } from '../base-tab/base-tab.component';
import { PopupService } from '../../services/popup.service'
import { GenericDataService } from 'src/app/services/generic-data.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ParamService } from 'src/app/services/param-service.service';
import { BASE_CLASS_PARAMS } from '../base-tab/base-tab.tokens';
import { Injectable } from '@angular/core';
import { DataSharingService } from 'src/app/services/data-sharing.service';


@Component({
  selector: 'app-taxonomy',
  templateUrl: './taxonomy.component.html',
  styleUrl: './taxonomy.component.css'
})
export class TaxonomyComponent extends BaseTabComponent {
  
  someMethod(): void {
    console.log('Implemented abstract method');
  }

  initializeFields(): void {
    this.setParentAttributes({ "api_end_point": "taxonomy", "sp": "", "table_name": "taxonomy", "display_on_load": true })
  }

  // initializeFieldsForDialog(): void {
  //   this.setParentAttributes({ "api_end_point": "", "sp": "", "table_name": "taxonomy", "display_on_load": false })
  // }


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, paramService: ParamService, protected dataService: GenericDataService, protected popupService: PopupService, private dataSharingService: DataSharingService) {
    super(data, paramService, dataService, popupService, { "api_end_point": "taxonomy", "sp": "", "table_name": "taxonomy", "display_on_load": true });

  }

  // getSearchParams(): any {
  //   let job_ids = this.extractCheckedIDs("job_id");
  //   let params = { "job_ids": job_ids, "minimum_should_match": 1 }
  // }
  

  // ngOnInit() {
  //   this.dataSharingService.data$.subscribe(data => {
  //     this.showGrid(data);
  //     // Optionally, perform any necessary logic with the received data
  //   });
  // }

  // showGrid(data) {
  //   // Implement your method logic here
  //   this.data = data;
  //   console.log('Method called from FirstTabComponent');
  //   this.agGrid.loadGridColAndRows(data)
  // }
}
