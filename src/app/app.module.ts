import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MaterialDateEditorComponent } from './components/material-date-editor/material-date-editor.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { DynamicGridComponent } from './dynamic-grid/dynamic-grid.component';
import { AgGridModule } from 'ag-grid-angular';
// import { DataService } from './data.service';
import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule
import { CandidateTabComponent } from './components/candidate-tab/candidate-tab.component';
import { BaseTabComponent } from './components/base-tab/base-tab.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { GenericDataService } from './services/generic-data.service';
import { SearchService } from './services/search.service';
import { PopupService } from './services/popup.service'
import { JobApplicationsPopupComponent } from './components/job-applications-popup/job-applications-popup.component';
import { JobApplicationComponent } from './components/job-application/job-application.component';
import { CallingListComponent } from './components/calling-list/calling-list.component';
import { GenericSearchComponent } from './components/generic-search/generic-search.component'
import { TaxonomyComponent } from './components/taxonomy/taxonomy.component'
import { StatusReportTabComponent } from './components/status-report-tab/status-report-tab.component';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { JobTabComponent } from './components/job-tab/job-tab.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BASE_CLASS_PARAMS } from './components/base-tab/base-tab.tokens'; // Adjust the path as necessary
import { DataSharingService } from './services/data-sharing.service'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MultiSelectDropdownComponent } from './components/multi-select-dropdown/multi-select-dropdown.component';
import { DialogComponent } from './components/dialog/dialog.component'
import { LogTabComponent } from './components/log-tab/log-tab.component'
import { MessageDialogComponent} from './components/app-message-dialog/app-message-dialog.component';
import { ConversationDialogComponent } from './components/conversation-dialog/conversation-dialog.component';
import {FileUploadComponent} from './components/file-upload/file-upload.component'
import { FacebookPostComponent} from './components/facebook-post/facebook-post.component';
import { FacebookPostDialogComponent } from './components/facebook-post-dialog/facebook-post-dialog.component';
import { TravelComponent} from './components/travel/travel.component';
import { TravelDialogComponent } from './components/travel-dialog/travel-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { DefaultsTabComponent } from './components/defaults-tab/defaults-tab.component';
import { MsalModule, MsalInterceptor, MsalService, MsalGuard, MSAL_INSTANCE } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { MSALInstanceFactory } from 'src/msal-config';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    FacebookPostComponent,
    FacebookPostDialogComponent,
    TravelComponent,
    TravelDialogComponent,
    DialogComponent,
    MessageDialogComponent,
    AppComponent,
    DynamicGridComponent,
    CandidateTabComponent,
    JobApplicationsPopupComponent,
    JobTabComponent,
    JobApplicationComponent,
    CallingListComponent,
    TaxonomyComponent,
    BaseTabComponent,
    MultiSelectDropdownComponent,
    GenericSearchComponent,
    StatusReportTabComponent,
    LogTabComponent,
    ConversationDialogComponent,
    FileUploadComponent,
    DefaultsTabComponent,
    MaterialDateEditorComponent,
  ],
  imports: [
    BrowserModule,
    AgGridModule,
    HttpClientModule,
    MatTabsModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    AgGridModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatCheckboxModule,
    FlexLayoutModule,
    MatIconModule,
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    FormsModule,
    MatDatepickerModule,
    MatDatepickerModule,
        MsalModule.forRoot(MSALInstanceFactory(), {
      interactionType: InteractionType.Popup,
      authRequest: {
        scopes: ['User.Read'],
      },
    }, null),

  ],
  exports: [DynamicGridComponent,MaterialDateEditorComponent],
  providers: [GenericDataService, PopupService, DataSharingService, SearchService,MsalService, MsalGuard,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
        {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },

    { provide: BASE_CLASS_PARAMS, useValue: {} }],
  // providers: [DataService, PopupService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class AppModule { }