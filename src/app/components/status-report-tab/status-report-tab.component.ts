import { Component, Input, Inject, AfterViewInit } from '@angular/core';
import { BaseTabComponent } from '../base-tab/base-tab.component';
import { PopupService } from '../../services/popup.service'
import { GenericDataService } from 'src/app/services/generic-data.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ParamService } from 'src/app/services/param-service.service';
import { BASE_CLASS_PARAMS } from '../base-tab/base-tab.tokens';
import { Injectable } from '@angular/core';
import { DataSharingService } from 'src/app/services/data-sharing.service';



@Component({
  selector: 'app-status-report-tab',
  templateUrl: './status-report-tab.component.html',
  styleUrl: './status-report-tab.component.css'
})
export class StatusReportTabComponent extends BaseTabComponent {

  public refreshCursor: boolean = false
  
  someMethod(): void {
    console.log('Implemented abstract method');
  }
  pinnedRowData = []
  calculateTotalsAndPercentages(): void {
    // Calculate total age and salary
    const totalTexted = this.agGrid.rowData.reduce((sum, current) => sum + current.Texted, 0);
    const totalTalkTo = this.agGrid.rowData.reduce((sum, current) => sum + current.TalkTo, 0);
    const totalScheduled = this.agGrid.rowData.reduce((sum, current) => sum + current.Scheduled, 0);
    const totalRTR = this.agGrid.rowData.reduce((sum, current) => sum + current.RTR, 0);
    const totalMessage = this.agGrid.rowData.reduce((sum, current) => sum + current.Message, 0);
    const totalRejected = this.agGrid.rowData.reduce((sum, current) => sum + current.Rejected, 0);
    const totalToPresent = this.agGrid.rowData.reduce((sum, current) => sum + current.ToPresent, 0);
    const totalInterview = this.agGrid.rowData.reduce((sum, current) => sum + current.Interview, 0);
    const totalPresented = this.agGrid.rowData.reduce((sum, current) => sum + current.Presented, 0);
    const totalPlaced = this.agGrid.rowData.reduce((sum, current) => sum + current.Placed, 0);
    // const totalAutoOutReach = this.agGrid.rowData.reduce((sum, current) => sum + current.Texted, 0);
    const totalAutoOutReach = this.agGrid.rowData.reduce((sum, current) =>
      sum +
      current.Texted +
      current.TalkTo +
      current.Scheduled +
      current.RTR +
      current.Message +
      current.Rejected +
      current.ToPresent +
      current.Interview +
      current.Presented +
      current.Placed, 0);
    

    const RespondedPercent = this.pct(totalAutoOutReach / totalTexted)
    const TalkToPercent = this.pct(totalTalkTo / totalAutoOutReach)
    const RTRPercent = this.pct(totalRTR / totalAutoOutReach)
    const MessagePercent = this.pct(totalMessage / totalAutoOutReach)
    const InterviewPercent = this.pct(totalInterview / totalInterview)
    const RejectedPercent = this.pct(totalRejected / totalAutoOutReach)
    const ToPresentPercent = this.pct(totalToPresent / totalAutoOutReach)
    const PresentedPrecented = this.pct(totalPresented / totalAutoOutReach)
    const PlacedPercent = this.pct(totalPlaced / totalAutoOutReach)

    this.pinnedRowData = [
      { title: 'Total', AutoOutReach:totalAutoOutReach, TalkTo: totalTalkTo, Scheduled:totalScheduled,RTR:totalRTR,Message:totalMessage, Rejected: totalRejected,  ToPresent: totalToPresent, Interview:totalInterview, Presented: totalPresented, Placed: totalPlaced },
      { title: '%', AutoOutReach: '', TalkTo: TalkToPercent,Scheduled:'',RTR:RTRPercent, Message:MessagePercent, Rejected: RejectedPercent, ToPresent: ToPresentPercent, Interview:InterviewPercent, Presented: PresentedPrecented,Placed: PlacedPercent}
    ];
    this.pinRow(this.pinnedRowData)

    // Set the pinned bottom row data
    // this.pinnedBottomRowData = [
    //   { name: 'Total', age: totalAge, salary: totalSalary },
    //   { name: 'Average', age: `${TalkToPercent}%`, salary: `${percentageSalary}%` }
    // ];

  }

  pct(value: number): number {
    return parseFloat((value * 100).toFixed(2));
  }


  onChildNotify() {
    console.log('Parent method called by the child component');
    this.calculateTotalsAndPercentages();
  }
  initializeFields(): void {
    this.setParentAttributes({ "api_end_point": "get_sourcing_status_report", "sp": "", "table_name": "dynamic", "display_on_load": true })
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, paramService: ParamService, protected dataService: GenericDataService, protected popupService: PopupService, private dataSharingService: DataSharingService) {
    super(data, paramService, dataService, popupService, { "api_end_point": "get_sourcing_status_report", "sp": "", "table_name": "dynamic", "display_on_load": true });
  }

  onClickRefreshStats() {
      this.refreshCursor = this.showWait(this.refreshCursor);
    this.dataService.fetchDataPost('get_sourcing_status_report', null, {}).subscribe(data => {
      this.showGrid(data)
      this.refreshCursor = this.hideWait(this.refreshCursor);

    })
  }
}
