import { Observable } from 'rxjs';
import { Input, OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/search.service'
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-generic-search',
  templateUrl: './generic-search.component.html',
})
export class GenericSearchComponent implements OnInit {
  @Input() columns: string[] = [];  // List of searchable columns
  @Input() tableName: string = '';  // Table name to pass to the service
  @Input() sp: string = '';  // Table name to pass to the service

  @Output() triggerParentMethod = new EventEmitter<void>();

  selectedColumn: string = '';
  searchValue: string = '';
  results: any[] = [];

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
    // if (this.columns.length > 0) {
    //   this.selectedColumn = 'this.columns[0]';  // Default to first column
    // }
  }

  getSearchResults(customer_account, source): Observable<any[]> {
    let params = { "customer_account": customer_account, "source": source, "table_name": this.tableName, "sp": this.sp, "column": this.selectedColumn, "value": this.searchValue }
    return this.searchService.search(params)

  }

  onClickSearchField() {
    if (this.selectedColumn === '') {
      alert('Please select a valid field to search.');
      return;
    }
    this.triggerParentMethod.emit(); // Emit event to call parent method
  }


}
