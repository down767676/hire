// src/app/components/tab1/tab1.component.ts
import { Component , Input} from '@angular/core';
import { BaseTabComponent } from '../base-tab/base-tab.component';

@Component({
  selector: 'app-candidatetab',
  templateUrl: '../base-tab/base-tab.component.html',
  styleUrls: ['../base-tab/base-tab.component.css']
})
export class CandidateTabComponent extends BaseTabComponent {
  initializeFields(): void {
    this.searchFields = ['field1', 'field2'];
    this.selectedOptions = ['', ''];
    this.setParentAttributes("get_campaign", "", "candidateprofile")
  }

}
