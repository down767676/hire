// src/app/components/tab1/tab1.component.ts
import { Component , Input, Inject} from '@angular/core';
import { BaseTabComponent } from '../base-tab/base-tab.component';
import { GenericDataService } from 'src/app/services/generic-data.service';
import { PopupService } from '../../services/popup.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ParamService } from 'src/app/services/param-service.service';
import { BASE_CLASS_PARAMS } from '../base-tab/base-tab.tokens';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-candidatetab',
  // templateUrl: '../base-tab/base-tab.component.html',
  templateUrl: './candidate-tab.component.html',
  styleUrls: ['../base-tab/base-tab.component.css']
})
export class CandidateTabComponent extends BaseTabComponent {
constructor(@Inject(MAT_DIALOG_DATA) public data: any, protected paramService:ParamService, protected dataService:GenericDataService,protected popupService:PopupService, @Inject(BASE_CLASS_PARAMS) params:any)
  {
    super(data, paramService, dataService, popupService, {"api_end_point":"get_campaign", "sp":"", "table_name":"candidateprofile", "display_on_load":true});
  }
  
  someMethod(): void {
    console.log('Implemented abstract method');
}
  
  initializeFields(): void {
    this.setParentAttributes({"api_end_point":"get_campaign", "sp":"", "table_name":"candidateprofile", "display_on_load":true})
  }

  // onButtonClickSearch() {
  // }

  getSearchParams(): any {
    let job_ids = this.extractCheckedIDs("job_id");
    let params = { "job_ids": job_ids, "minimum_should_match": 1 }
  }


}
