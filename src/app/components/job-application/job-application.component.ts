import { ConversationDialogComponent } from '../../components/conversation-dialog/conversation-dialog.component'
import { MatSelectChange } from '@angular/material/select';
import { Component, Input, ViewChild, Inject, Output, EventEmitter } from '@angular/core';
import { BaseTabComponent } from '../base-tab/base-tab.component';
import { PopupService } from '../../services/popup.service'
import { GenericDataService } from 'src/app/services/generic-data.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ParamService } from 'src/app/services/param-service.service';
import { BASE_CLASS_PARAMS } from '../base-tab/base-tab.tokens';
import { Injectable } from '@angular/core';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component'; // Adjust the path based on your setup
import { MessageDialogComponent } from '../app-message-dialog/app-message-dialog.component'
import { FacebookPostDialogComponent } from '../facebook-post-dialog/facebook-post-dialog.component';
import { TravelDialogComponent } from '../travel-dialog/travel-dialog.component';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'
import { EmailMessageDialogComponent } from '../app-email-message-dialog/app-email-message-dialog.component';
@Component({
  selector: 'app-job-application',
  templateUrl: './job-application.component.html',
  styleUrls: ['./job-application.component.css']
})
export class JobApplicationComponent extends BaseTabComponent {

  public conversationCursor: boolean = false
  public refreshCursor: boolean = false
  public matchingCursor: boolean = false
  public matchingRecruiterCursor: boolean = false
  selectedMessageType: string = '';
  private apiUrl = environment.apiUrl;
    
  public facebook_post_url = `${this.apiUrl}/generate-travel-report`;
  public travel_url = `${this.apiUrl}/generate-travel-report`;


  searchFields = ['field1', 'field2'];
  selectedOptions = ['', ''];
  api_end_point = "search_candidates";
  sp = "";
  table_name = "jobapplication";
  display_on_load = false
  public source_columns = ["all","npi","ceipal"];
  public selectedView: string = null
  public selected_source = this.source_columns[0]


  public normalizedTitleOptions = [
    "Medical Assistant",
    "RN Case Manager"
  ]
  normalizedTitleOption: String = "Medical Assistant"

  distancetOption: String = '20'
  public distancetOptions = [
    '5','10', '12','15','17','20', '25', 'state', 'country'
  ]

  public employmentOptions = [
    "full time",
    "contract"
  ]
  employmentOption: String = "Medical Assistant"
  
  selectedTask: String = "TalkTo.5"
  stateStatus: string = '';
  public tasks = [
    { "code": "AMTasks.0", "value": "AM Tasks" },
    { "code": "TalkTo.5", "value": "Talk To in last 5 days" },
    { "code": "TalkTo.6", "value": "Talk To in last 6 days" },
    { "code": "TalkTo.7", "value": "Talk To in last 7 days" },
    { "code": "TalkTo.10", "value": "Talk To in last 10 days" },
    { "code": "TalkTo.12", "value": "Talk To in last 12 days" },
    { "code": "TalkTo.15", "value": "Talk To in last 15 days" },
    { "code": "TalkTo.30", "value": "Talk To in last 30 days" },
    { "code": "TalkTo.60", "value": "Talk To in last 60 days" },
    { "code": "TalkTo.90", "value": "Talk To in last 90 days" },
    { "code": "TalkTo.365", "value": "Talk To in last 365 days" },  
    { "code": "Submission.1", "value": "Submission in last 1 days" },
    { "code": "Submission.2", "value": "Submission in last 2 days" },
    { "code": "Submission.3", "value": "Submission in last 3 days" },
    { "code": "Submission.4", "value": "Submission in last 4 days" },
    { "code": "Submission.5", "value": "Submission in last 5 days" },
    { "code": "Submission.6", "value": "Submission in last 6 days" },
    { "code": "Submission.7", "value": "Submission in last 7 days" },
    { "code": "Submission.10", "value": "Submission in last 10 days" },
    { "code": "Submission.12", "value": "Submission in last 12 days" },
    { "code": "Submission.15", "value": "Submission in last 15 days" },
    { "code": "Submission.30", "value": "Submission in last 30 days" },
    { "code": "Submission.60", "value": "Submission in last 60 days" },
    { "code": "Submission.90", "value": "Submission in last 90 days" },
    { "code": "Submission.365", "value": "Submission in last 365 days"},
    { "code": "Responded.1", "value": "Responded in last 1 days" },
    { "code": "Responded.2", "value": "Responded in last 2 days" },
    { "code": "Responded.3", "value": "Responded in last 3 days" },
    { "code": "Responded.4", "value": "Responded in last 4 days" },
    { "code": "Responded.5", "value": "Responded in last 5 days" },
    { "code": "Responded.6", "value": "Responded in last 6 days" },
    { "code": "Responded.7", "value": "Responded in last 7 days" },
    { "code": "Responded.15", "value": "Responded in last 15 days" },
    { "code": "Responded.30", "value": "Responded in last 30 days" },
    { "code": "Responded.60", "value": "Responded in last 60 days" },
    { "code": "Responded.90", "value": "Responded in last 90 days" },
    { "code": "Responded.365", "value": "Responded in last 365 days" },
    { "code": "NotTextedCount.100", "value": "Not Texted (Last 100)" },
    { "code": "NotTextedCount.200", "value": "Not Texted (Last 200)" },
    { "code": "NotTextedCount.300", "value": "Not Texted (Last 300)" },
    { "code": "NotTextedCount.400", "value": "Not Texted (Last 400)" },
    { "code": "NotTextedCount.500", "value": "Not Texted (Last 500)" },
    { "code": "NotTextedCount.1000", "value": "Not Texted (Last 1000)" },
    { "code": "NotTextedCount.2000", "value": "Not Texted (Last 2000)" },
    { "code": "NotTextedCount.3000", "value": "Not Texted (Last 3000)" },
    { "code": "NotTextedCount.4000", "value": "Not Texted (Last 4000)" },
    { "code": "NotTextedCount.6000", "value": "Not Texted (Last 6000)" },
    { "code": "NotTextedCount.10000", "value": "Not Texted (Last 10000)" },
    { "code": "NotTextedDays.1", "value": "Not Texted (Searched in last 1 days)" },
    { "code": "NotTextedDays.2", "value": "Not Texted (Searched in last 2 days)" },
    { "code": "NotTextedDays.3", "value": "Not Texted (Searched in last 3 days)" },
    { "code": "NotTextedDays.4", "value": "Not Texted (Searched in last 4 days)" },
    { "code": "NotTextedDays.5", "value": "Not Texted (Searched in last 5 days)" },
    { "code": "NotTextedDays.6", "value": "Not Texted (Searched in last 6 days)" },
    { "code": "NotTextedDays.7", "value": "Not Texted (Searched in last 7 days)" },
    { "code": "NotTextedDays.15", "value": "Not Texted (Searched in last 15 days)" },
    { "code": "NotTextedDays.30", "value": "Not Texted (Searched in last 30 days)" },
    { "code": "NotTextedDays.60", "value": "Not Texted (Searched in last 60 days)" },
    { "code": "NotTextedDays.90", "value": "Not Texted (Searched in last 90 days)" },
    { "code": "NotTextedDays.365", "value": "Not Texted (Searched in last 365 days)" },
    { "code": "Texted.1", "value": "Texted in last 1 days" },
    { "code": "Texted.2", "value": "Texted in last 2 days" },
    { "code": "Texted.3", "value": "Texted in last 3 days" },
    { "code": "Texted.4", "value": "Texted in last 4 days" },
    { "code": "Texted.5", "value": "Texted in last 5 days" },
    { "code": "Texted.6", "value": "Texted in last 6 days" },
    { "code": "Texted.7", "value": "Texted in last 7 days" },
    { "code": "Texted.15", "value": "Texted in last 15 days" },
    { "code": "Texted.30", "value": "Texted in last 30 days" },
    { "code": "Texted.60", "value": "Texted in last 60 days" },
    { "code": "Texted.90", "value": "Texted in last 90 days" },
    { "code": "Texted.365", "value": "Texted in last 365 days"} ,
    { "code": "GetCandidiates.Nearby", "value": "Show Nearby Candidates" },
    { "code": "GetCandidiates.NearFullTime", "value": "Show Nearby Full Time Candidates" },
    { "code": "GetCandidiates.Travel", "value": "Show Travel Candidates" }
  ]

  someMethod(): void {
    console.log('Implemented abstract method');
  }

  // initializeFields(): void {
  //   this.setParentAttributes({ "api_end_point": "get_campaign", "sp": "", "table_name": "jobapplication", "display_on_load": true })
  // }
  initializeFields(): void {
    this.setParentAttributes({ "api_end_point": this.api_end_point, "sp": "", "table_name": "jobapplication", "display_on_load": true })

  }

  initializeFieldsForDialog(): void {
    this.setParentAttributes({ "api_end_point": "", "sp": "", "table_name": "jobapplication", "display_on_load": false })
  }

get sendLabel(): string {
  return this.agGrid?.clearOtherRowsOnSelect ? 'Send Single' : 'Send Bulk';
}

  constructor(private http: HttpClient, @Inject(MAT_DIALOG_DATA) public data: any, paramService: ParamService, protected dataService: GenericDataService, protected popupService: PopupService, private dataSharingService: DataSharingService, public dialog: MatDialog) {
    super(data, paramService, dataService, popupService, { "api_end_point": "get_campaign", "sp": "", "table_name": "candidateprofile", "display_on_load": true });

  }


// onCreateMessage() {
//   const ids = this.getMobileSelectedIds();

//   // if (ids.length > 1) {
//   //   alert('Error: More than one row has the value "yes"');
//   //   return;
//   // } else if (ids.length === 0) {
//   //   alert('No row with "yes" selected');
//   //   return;
//   // }

//   const row = this.getFirstSelectedRow();

//   if (!this.selectedMessageType) {
//     alert("Message type must be selected.");
//     return;
//   }

//   const jobapplication_id = row.data.jobapplication_id;
//   const scenario = this.selectedMessageType;
//   const isEmail = scenario.includes('email');
//   const endpoint = isEmail ? 'get_email_message' : 'get_message';

//   const jsonData = { jobapplication_id, scenario };

//   this.dataService.fetchDataPost(endpoint, null, jsonData).subscribe(data => {
//     let dialogRef;

//     if (isEmail) {
//       dialogRef = this.dialog.open(EmailMessageDialogComponent, {
//         width: '70vw',
//         maxWidth: '70vw',
//         height: '70vh',
//         data:{ email:{
//           from: data.from,
//           to: data.to,
//           subject: data.subject,
//           body: data.body

//         },
//         sendLabel:this.sendLabel
//       }
//       });
//     } else {
//       dialogRef = this.dialog.open(MessageDialogComponent, {
//         width: '70vw',
//         maxWidth: '70vw',
//         height: '70vh',
//         data: { message: data ,
//           sendLabel:this.sendLabel
//         }
//       });
//     }

    
//     dialogRef.afterClosed().subscribe(result => {
//       if (!result) return;

//       if (isEmail) {
//         // Normalize and trim all fields
//         const from = (result.from || '').trim();
//         const to = (result.to || '').trim();
//         const subject = (result.subject || '').trim();
//         const body = (result.body || '').trim();

//         const missingFields = [];
//         if (!from) missingFields.push("From");
//         if (!to) missingFields.push("To");
//         if (!subject) missingFields.push("Subject");
//         if (!body) missingFields.push("Body");

//         if (missingFields.length > 0) {
//           alert(`The following fields are required: ${missingFields.join(", ")}`);
//           return;
//         }
//       }

//       const payload = isEmail
//         ? { scenario, jobapplication_id, ...result }
//         : { scenario,jobapplication_id, message: result };

//       const postEndpoint = isEmail ? 'send_email' : 'send_text';

//       this.dataService.fetchDataPost(postEndpoint, null, payload).subscribe(response => {
//         // Optionally notify the user of success
//       });
//     });
//   });
// }

onCreateMessage() {
  const scenario = this.selectedMessageType;
  if (!scenario) {
    alert("Message type must be selected.");
    return;
  }

  const isEmail = scenario.includes('email');
  const endpoint = isEmail ? 'get_email_message' : 'get_message';

  const selectedIds = this.getMobileSelectedIds();
  if (selectedIds.length === 0) {
    alert("Please select at least one candidate.");
    return;
  }

  const selectedRows = this.agGrid.rowData.filter(row => selectedIds.includes(row.jobapplication_id));

  const previewRow = selectedRows[0];
  const jsonData = {
    email: previewRow.jobapplication_id,
    scenario
  };

  this.dataService.fetchDataPost(endpoint, null, jsonData).subscribe(async data => {
    const dialogRef = isEmail
      ? this.dialog.open(EmailMessageDialogComponent, {
          width: '70vw',
          maxWidth: '70vw',
          height: '70vh',
          data: {
            email: {
              from: data.from,
              to: data.to,
              subject: data.subject,
              body: data.body
            },
            sendLabel: this.sendLabel
          }
        })
      : this.dialog.open(MessageDialogComponent, {
          width: '70vw',
          maxWidth: '70vw',
          height: '70vh',
          data: {
            message: data,
            sendLabel: this.sendLabel
          }
        });

    dialogRef.afterClosed().subscribe(async result => {
      if (!result) return;

      for (const row of selectedRows) {
        const delay = Math.floor(Math.random() * 5000) + 5000; // 5000ms to 10000ms
        const name = row.first_name || 'Candidate';
        const jobapplication_id = row.jobapplication_id;

        if (isEmail) {
          const personalizedBody = result.body?.replace(/^Hi\s+\w+/i, `Hi ${name}`) || '';
          const payload = {
            scenario,
            jobapplication_id,
            from: result.from?.trim(),
            to: row.email || result.to?.trim(),
            subject: result.subject?.trim(),
            body: personalizedBody
          };

          await this.dataService.fetchDataPost('send_email', null, payload).toPromise();
        } else {
          const personalizedMessage = result.replace(/^Hi\s+\w+/i, `Hi ${name}`);
          const payload = {
            scenario,
            jobapplication_id,
            message: personalizedMessage
          };

          await this.dataService.fetchDataPost('send_text', null, payload).toPromise();
        }

        // Wait for random delay between 5 and 10 seconds
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    });
  });
}

  getSearchParams(): any {
    let job_ids = this.extractCheckedIDs("job_id");
    let params = { "job_ids": job_ids, "minimum_should_match": 1 }
  }

  getSendTextParams(): any {
    let ids = this.getMobileSelectedIds();
    let params = { "jobapplication_ids": ids, "source": "npi", "mode": "Test" }
    return params
  }

  getSelectedColVal(name): string {
    let value = null;

    this.agGrid.api.forEachNode((row) => {
      if (row.data.selected === 'yes') {
        value = (row.data[name]);
      }
    })
    return value;
  }

  getMobileSelectedIds(): number[] {
    const selectedIds: number[] = [];

    this.agGrid.api.forEachNode((row) => {
      if (row.data.selected === 'yes') {
        selectedIds.push(row.data['jobapplication_id']);
      }
    })
    return selectedIds;
  }

  getJobSelectedIds(): number[] {
    const selectedIds: number[] = [];

    this.agGrid.api.forEachNode((row) => {
      if (row.data.selected === 'yes') {
        selectedIds.push(row.data['job_id']);
      }
    })
    return selectedIds;
  }

  getFirstSelectedRow(): any {
    var retRow = null;
    this.agGrid.api.forEachNode((row) => {
      if (row.data.selected === 'yes') {
        retRow = row;
      }
    })
    return retRow;
  }

  sendEmail() {
    super.sendEmail();
    // Add additional logic for sending email
    console.log('Additional email logic');
  }

  sendText(params): void {
    // const params = this.buildSearchParams();
    // this.refreshCursor = this.showWait(this.refreshCursor);
    // this.dataService.fetchDataPost('send_batch', null, params).subscribe(data => {
    //   this.refreshCursor = this.hideWait(this.refreshCursor);
    // });
    // this.dataService.fetchDataPost('send_batch', null, params);
    this.dataService.fetchDataPost('send_batch', null, params).subscribe(data => {
    });

  }

  ngOnInit() {
    this.dataSharingService.data$.subscribe(data => {
      this.showGrid(data);
          this.getStatus();
      // Optionally, perform any necessary logic with the received data
    });
  }

  getStatus(): void {
    this.dataService.fetchDataPost('broadcast/status', null, {"status":this.stateStatus}).subscribe(res => {
      this.stateStatus = res.status;
    });
  }

  setBroadcast(status: 'Stopped' | 'Running'): void {
    this.dataService.fetchDataPost('broadcast/set', null,{ "status":status }).subscribe(() => {
      this.getStatus();
    });
  }
    onClickSendText() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Text Candidates',
        content: 'All Texts will be sent within 15 minutes depending on the number of texts to be sent. You can check the text sent using the Text Sent in last 3 days Task',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // OK button was clicked
        let params = this.getSendTextParams()
        this.sendText(params);
      } else {
        // Cancel button was clicked
        console.log('User canceled the action');
      }
    });


  }

  onTaskChange(event: MatSelectChange) {
    this.go(this.selectedTask);
  }

  ngAfterViewInit(): void {
    this.dataService.fetchDataPost('jobapplications', null, { 'task': this.selectedTask,'source':this.selected_source }).subscribe(data => {
      this.showGrid(data);
    })

    // this.agGrid.loadGridColAndRows(this.data)
  }



  showMatchedJobsDetailed() {
    this.matchingRecruiterCursor = this.showWait(this.matchingRecruiterCursor);

    this.showJobsByDistance_sub('recruiter')
  }

  onClickRefreshJobApplications() {
    // let params = this.getSearchCandididateParams()
    this.go(this.selectedTask);
  }



  showJobsByDistance() {
    this.matchingCursor = this.showWait(this.matchingCursor);

    this.showJobsByDistance_sub('candidate')
  }

  showJobsByDistance_sub(level) {

    var ids = this.getMobileSelectedIds()

    if (ids.length > 1) {
      alert('Error: More than one row has the value "yes"');
      return;
    } else if (ids.length === 0) {
      alert('No row with "yes" selected');
      return;
    }
    this.dataService.fetchDataPost('get_jobs_by_distance_str', null, { 'jobapplication_id': ids[0], 'level': level }).subscribe(data => {
      this.matchingCursor = this.hideWait(this.matchingCursor);
      this.matchingRecruiterCursor = this.hideWait(this.matchingRecruiterCursor);
      if (data) {
        this.dialog.open(ConversationDialogComponent, {
          data: { conversationHistory: data },
          width: '70vw', // Adjust as needed
          maxWidth: '70vw', // Prevents it from shrinking below this width
          height: '70vh', // Adjust as needed for height        
        });
      } else {
        alert("No data found");
      }

    })
  }


  showConversation() {
    this.refreshCursor = this.showWait(this.conversationCursor);

    var ids = this.getMobileSelectedIds()

    if (ids.length > 1) {
      alert('Error: More than one row has the value "yes"');
      return;
    } else if (ids.length === 0) {
      alert('No row with "yes" selected');
      return;
    }
    const jobapplication_id = this.getSelectedColVal('jobapplication_id')
    this.dataService.fetchDataPost('get_job_application', null, { 'jobapplication_id': jobapplication_id  }).subscribe(data => {
      const conversation_history  = data[0]['conversation_history']
    // const conversation_history = this.getSelectedColVal('conversation_history')
    this.refreshCursor = this.hideWait(this.conversationCursor);
    if (conversation_history) {
      this.dialog.open(ConversationDialogComponent, {
        data: { conversationHistory: conversation_history },
        width: '70vw', // Adjust as needed
        maxWidth: '70vw', // Prevents it from shrinking below this width
        height: '70vh', // Adjust as needed for height        
      });
    } else {
      alert("No data found");
    }
    })

  }

    openFacebookPostDialog(): void {
      var ids = this.getJobSelectedIds()
  
      if (ids.length > 1) {
        alert('Error: More than one row has the value "yes"');
        return;
      } else if (ids.length === 0) {
        alert('No row with "yes" selected');
        return;
      }
  
      this.dialog.open(FacebookPostDialogComponent, {
        width: '600px',
        data: { jobId:ids[0], url: this.facebook_post_url}, // Pass jobId and url to the dialog component
      });
    }
  
      openTravelDialog(): void {
        var ids = this.getJobSelectedIds()
    
        if (ids.length > 1) {
          alert('Error: More than one row has the value "yes"');
          return;
        } else if (ids.length === 0) {
          alert('No row with "yes" selected');
          return;
        }
    
        this.dialog.open(TravelDialogComponent, {
          width: '600px',
          data: { jobId:ids[0], url: this.travel_url}, // Pass jobId and url to the dialog component
        });
      }
      
    
  go(selectedTask) {
    if (this.isValid(selectedTask)) {
      this.refreshCursor = this.showWait(this.refreshCursor);
      this.dataService.fetchDataPost('jobapplications', null, { 'task': selectedTask }).subscribe(data => {
        this.showGrid(data);
        this.refreshCursor = this.hideWait(this.refreshCursor);
      })
    }
  }
}
