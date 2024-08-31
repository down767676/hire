import { Observable } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { SearchService } from  'src/app/services/search.service'

@Component({
  selector: 'app-generic-search',
  templateUrl: './generic-search.component.html',
})
export class GenericSearchComponent implements OnInit {
  @Input() columns: string[] = [];  // List of searchable columns
  @Input() tableName: string = '';  // Table name to pass to the service
  @Input() sp: string = '';  // Table name to pass to the service
  selectedColumn: string = '';
  searchValue: string = '';
  results: any[] = [];
  
  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    if (this.columns.length > 0) {
      this.selectedColumn = this.columns[0];  // Default to first column
    }
  }

  getSearchResults(customer_account, source): Observable<any[]> {   
    let params = {"customer_account":customer_account, "source":source, "table_name":this.tableName, "sp":this.sp, "column":this.selectedColumn, "value":this.searchValue} 
    return this.searchService.search(params)

}


  // onSearch(): void {
  //   if (this.tableName && this.selectedColumn && this.searchValue) {
  //     this.searchService.search(this.tableName, this.selectedColumn, this.searchValue)
  //       .subscribe(data => {
  //         this.results = data;
  //       }, error => {
  //         console.error('Search error:', error);
  //       });
  //   }
  // }
}
