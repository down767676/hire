
import {HelloTestCellComponent} from './components/hello-test-cell/hello-test-cell.component'
import { RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';import { FormsModule } from '@angular/forms';
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
import { SessionService } from './services/sessionservice.service';
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
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { ControlPageComponent } from './components/control-page/control-page.component';
import { MatDividerModule } from '@angular/material/divider';
import { PackageReadyComponent } from './components/package-ready/package-ready.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { QuillModule } from 'ngx-quill';
import {EditDescriptionDialogComponent} from './components/edit-description-dialog/edit-description-dialog.component'
import {DescriptionButtonCellComponent} from './components/description-button-cell/description-button-cell.component'
import { HelloWorldCellComponent } from './components/hello-world-cell/hello-world-cell.component';
import { EditHtmlDialogComponent } from './components/edit-html-dialog/edit-html-dialog.component'
import { MatOptionModule } from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    FacebookPostComponent,
    FacebookPostDialogComponent,
    TravelComponent,
    TravelDialogComponent,
    DialogComponent,
    MessageDialogComponent,
    DynamicGridComponent,
    CandidateTabComponent,
    JobApplicationsPopupComponent,
    HelloWorldCellComponent,
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
    SearchResultsComponent,
    ControlPageComponent,
    PackageReadyComponent,
    EditDescriptionDialogComponent,
    DescriptionButtonCellComponent,
    HelloTestCellComponent,
    EditHtmlDialogComponent,
    
  ],
  imports: [
    AgGridModule,
    BrowserModule,
    BrowserAnimationsModule,
    QuillModule.forRoot(),
    HttpClientModule,
    FormsModule,
        AgGridModule,
      
    NgIdleKeepaliveModule.forRoot(),
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent },
      { path: 'app', component: DashboardComponent, canActivate: [MsalGuard] },
      { path: '', redirectTo: 'app', pathMatch: 'full' },
      { path: '**', redirectTo: 'app' }
    ]),
    FlexLayoutModule,
    MatTabsModule,
    MatTableModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    NgIdleKeepaliveModule ,
    MatOptionModule,
    MsalModule.forRoot(
      MSALInstanceFactory(),
      {
        interactionType: InteractionType.Popup,
        authRequest: {
          scopes: ['User.Read'],
        },
      },
      {
        interactionType: InteractionType.Popup,
        protectedResourceMap: new Map()
      }
    ),
  ],
  exports: [DynamicGridComponent, MaterialDateEditorComponent],
  providers: [
    GenericDataService,
    SessionService,
    PopupService,
    DataSharingService,
    SearchService,
    MsalService,
    MsalGuard,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: BASE_CLASS_PARAMS, useValue: {} }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}