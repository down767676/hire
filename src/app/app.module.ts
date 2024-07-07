import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { DynamicGridComponent } from './dynamic-grid/dynamic-grid.component';
import { AgGridModule } from 'ag-grid-angular';
import { DataService } from './data.service';
import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from "@angular/material/form-field";
import { CandidateTabComponent } from './components/candidate-tab/candidate-tab.component';
import { BaseTabComponent } from './components/base-tab/base-tab.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { GenericDataService } from './services/generic-data.service';
import { JobTabComponent } from './components/job-tab/job-tab.component';


@NgModule({
  declarations: [
    AppComponent,
    DynamicGridComponent,
    CandidateTabComponent,
    BaseTabComponent  ,
    JobTabComponent 
  ],
  imports: [
    BrowserModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    AgGridModule,
    BrowserAnimationsModule
  ],
  providers: [GenericDataService],
  // providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
