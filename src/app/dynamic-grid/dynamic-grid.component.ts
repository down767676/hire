import { formatDate } from '@angular/common';
import { Component, OnInit, Input, Inject, numberAttribute } from '@angular/core';
import { GenericDataService } from '../services/generic-data.service';
import { ColDef, GridOptions, GridApi } from 'ag-grid-community';
import { GridConfigService } from '../grid-config.service';
import { GridProperties } from '../grid-properties.interface';
// import 'ag-grid-enterprise';

import { GridColumn } from '../grid-properties.interface';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ParamService } from 'src/app/services/param-service.service';
import { MultiSelectDropdownComponent } from '../components/multi-select-dropdown/multi-select-dropdown.component';

// ../multi-select-dropdown/multi-select-dropdown.component'

@Component({
  selector: 'app-dynamic-grid',
  templateUrl: './dynamic-grid.component.html',
  styleUrls: ['./dynamic-grid.component.css']
})
export class DynamicGridComponent implements OnInit {
  @Input() gridOptions: GridOptions;
  @Input() rowData: any[] = [];
  @Input() columnDefs: ColDef[] = [];
  @Input() defaultColDef = {
    editable: true,
    sortable: true,
    filter: true,
    resizable: true
  };

  @Input() table_name: string;
  @Input() api_end_point: string;
  @Input() sp: string;
  @Input() display_on_load: boolean;
  selectedView = null;

  multiSelectDropdownComponent = null
  public filteredRowCount: number = 0;
  components = {
    'multiSelectDropdownComponent': MultiSelectDropdownComponent
  };
  private isLoaded: Boolean
  private isDataLoaded: boolean = false
  private gridInited: boolean
  // gridOptions!: GridOptions;
  public api!: GridApi;
  public views: any;

  constructor(private dataService: GenericDataService, protected paramService: ParamService, protected garamService: ParamService, private gridConfigService: GridConfigService) {


    this.gridOptions = {
      onGridReady: (params) => this.onGridReady(params),
      onCellValueChanged: (event) => this.onCellValueChanged(event),
      rowSelection: 'multiple',  // Enable multiple row selection
      rowMultiSelectWithClick: true, // Allow multiple row selection with click
      onFilterChanged: () => this.updateFilteredRowCount()
      // onSelectionChanged: this.onSelectionChanged.bind(this)  // Bind the selection change event
    };
  }

  // getAttributes()
  // {
  //   this.api_end_point = this.paramService.getApiEndPoint();
  //   this.sp = this.paramService.getSp();

  //   this.table_name = this.paramService.getTableName();
  //   this.display_on_load = this.paramService.getDisplayOnLoad()
  // }


  dateComparator(date1: string, date2: string): number {
    // Attempt to parse the dates
    const dateObj1 = Date.parse(date1);
    const dateObj2 = Date.parse(date2);
  
    // Handle invalid dates
    if (isNaN(dateObj1) && isNaN(dateObj2)) {
      console.error('Invalid date format:', date1, date2);
      return 0  // Treat invalid dates as equal
    }
else if (isNaN(dateObj1) && !isNaN(dateObj2)) {
  console.error('Invalid date format:', date1, date2);
  return 1  // Treat invalid dates as equal
}
else if (!isNaN(dateObj1) && isNaN(dateObj2)) {
  console.error('Invalid date format:', date1, date2);
  return -1  // Treat invalid dates as equal
}

    // Compare the timestamps
    if (dateObj1 < dateObj2) {
      return -1;
    }
    if (dateObj1 > dateObj2) {
      return 1;
    }
    return 0;
  }
  
  

  setAttributes(params: any) {
    this.api_end_point = params.get("api_end_point", null)
    this.sp = params.get("sp", null)
    this.table_name = params.get("api_entable_named_point", null)
    this.display_on_load = params.get("api_end_point", null)
  }

loadGridViews()
{
  this.gridConfigService.getGridViews(this.table_name).subscribe(data => {
    this.views = data["views"];
    this.selectedView = this.views[0].file
  });

}
  ngOnInit(): void {
    if (this.display_on_load) {
      this.loadGridColAndRows(null);
    }
    this.loadGridViews();
    // this.getAttributes();
  }

  searchAndLoad(api_end_point, sp, params) {
    this.dataService.fetchData(api_end_point, sp, params).subscribe(data => {
      if (data.length > 0) {
        this.rowData = data;
        this.isDataLoaded = true;
        if (this.api) {
          this.api.updateGridOptions({ columnDefs: this.columnDefs });
          this.api.updateGridOptions({ rowData: this.rowData });
          this.updateFilteredRowCount();
        }
      }
    });
  }

  loadFromRows(rowData) {
    if (this.api) {
      this.rowData = rowData;
      this.api.updateGridOptions({ columnDefs: this.columnDefs });
      this.api.updateGridOptions({ rowData: this.rowData });
    }
  }


  // Function to iterate through rowData and set the 'id' column to incrementing values
  setIncrementalIds() {
    let counter = 1; // Starting value for the ID column

    // Iterate through rowData and set the 'id' column
    this.rowData.forEach((row, index) => {
      row.id = counter++;  // Increment the ID value
    });

    console.log('Updated rowData:', this.rowData);

    // Apply the updated row data to the grid using applyTransaction
    const result = this.api.applyTransaction({ update: this.rowData });

    // Force the grid to refresh the cells
    this.api.refreshCells({ force: true });
    console.log('Transaction Result:', result);
  }
  loadData(rowData) {
    if (rowData) {
      this.loadFromRows(rowData)
    }
    else {
      this.searchAndLoad(this.api_end_point, this.sp, {})
    }
    this.updateFilteredRowCount()
  }


  // Function to export filtered rows to CSV
  exportToCSV() {
    if (this.api) {
      this.api.exportDataAsCsv({
        allColumns: true,   // Export all columns
        fileName: 'filtered_rows_export.csv' // Name of the exported file
      });
    }
  }

  onViewSelect(selectedViewName: string): void {
    // Call the service to download the selected file
    if (selectedViewName) {
      this.loadGridColAndRowsHelper(null, selectedViewName, false)
    }
  }

  loadGridColAndRows(rows: any){
    this.loadGridColAndRowsHelper(rows, this.table_name, true);
  }

  dateFormatter(params) {
    return formatDate(params.value, 'MM-dd-yyyy', 'en-US');
  }

  
  loadGridColAndRowsHelper(rows: any, view_name:string,loadData:boolean) {
    if (view_name == null){
      view_name =this.table_name;
    }
    this.gridConfigService.getGridProperties(view_name).subscribe((data: GridProperties) => {
      let cb = false
      const columnDefCheckBox: ColDef = {
        headerCheckboxSelection: true,  // Display checkbox in the header
        checkboxSelection: true,        // Display checkbox in each row
        headerCheckboxSelectionFilteredOnly: true, // Display header checkbox for only filtered rows
        width: 50,
        pinned: 'left'  // Pin the checkbox column to the left
      }
      this.columnDefs = data.columns.map((col: GridColumn) => {
        const columnDef: ColDef = {
          headerName: col.headerName,
          field: col.field,
          width: col.width,
          editable: col.editable
        };

        if (col.table) {
          columnDef["table"] = col.table
        }
        if (col.type === 'text') {
          columnDef.cellEditor = 'agTextCellEditor';
        } else if (col.type === 'number') {
          columnDef.cellEditor = 'agNumberCellEditor';
        } else if (col.type === 'date') {
          columnDef.comparator = this.dateComparator;
          columnDef.cellEditor = 'agDateCellEditor';
          columnDef.valueFormatter =  this.dateFormatter;
          columnDef.filter = 'agDateColumnFilter';
        }
        else if (col.type === 'boolean') {
          columnDef.cellEditor = 'agCheckboxCellEditor';
          columnDef.cellRenderer = 'agCheckboxCellRenderer';
        }
        else if (col.type === 'dropdown') {
          columnDef.cellEditor = 'agSelectCellEditor';
          columnDef.cellEditorParams = {
            values: col.values
          };
        }
        else if (col.type === 'checkbox') {
          cb = true
        }
        else if (col.type === 'multi-select-dropdown') {
          columnDef.cellEditor = MultiSelectDropdownComponent;
          // columnDef.cellRenderer = "MultiSelectDropdownComponent";
          // columnDef.cellEditorFramework = "MultiSelectDropdownComponent";
          columnDef.editable = true
          columnDef.cellEditorParams = {
            procName: col.option_sp_name, // Stored procedure name for fetching options
            codes: ['1', '2']
          };
        }
        return columnDef;
      }
      );

      if (cb) {
        this.columnDefs.push(columnDefCheckBox)
      }
      if (loadData)
      {
        this.loadData(rows)
      }
    }
    );
  }


  frameworkComponents = {
    multiSelectDropdownComponent: MultiSelectDropdownComponent
  };

  // Called when the filter is changed
  onFilterChanged() {
    this.updateFilteredRowCount();
  }

  // Updates the filtered row count
  updateFilteredRowCount() {
    if (this.api) {
      this.filteredRowCount = this.api.getDisplayedRowCount(); // Get the filtered row count
    }
  }

  // setSelectedToValue(selectedValue: string) {
  //   this.api.forEachNodeAfterFilter((node) => {
  //     const job = node.data;
      
  //     // Set the selected field to the desired value for filtered rows
  //     job.selected = selectedValue;
  
  //     // Call the service to update the database
  //     this.dataService.updateData(
  //       job[this.table_name + "_id"],
  //       "selected",
  //       selectedValue,
  //       this.table_name,
  //       this.table_name,
  //       job[this.table_name + "_id"]
  //     ).subscribe();
  //   });
  // }
  
  onGridReady(params: any) {
    this.gridInited = true;
    this.api = params.api;
    if (this.isDataLoaded) {
      params.api.setColumnDefs(this.columnDefs);
      params.api.setRowData(this.rowData);
    }
    this.updateFilteredRowCount(); // Initialize the filtered row count
  }

  onCellValueChanged(event: any) {
    const { data, colDef, newValue } = event;
    let t = null
    let tval = null
    if (colDef["table"]) {
      t = colDef["table"];
      tval = data[colDef["table"] + "_id"]
    }
    this.dataService.updateData(data[this.table_name + "_id"], colDef.field, newValue, this.table_name, t, tval).subscribe();
  }

  // Function to get all column definitions
  getAllColumns() {
    const allColumns = this.api.getColumns();
    if (allColumns) {
      allColumns.forEach(col => {
        console.log('Column:', col.getColDef().field); // Log each column field name
      });
    }
  }

  // Helper function to check if the "selected" column exists
  columnExists(columnName: string): boolean {
    const allColumns = this.api.getColumns();
    return allColumns.some(col => col.getColDef().field === columnName);
  }

  // setSelectedToYes() {
  //   const updatedData = [];

  //   // Get all rows and set the "selected" column to "yes"
  //   this.api.forEachNode((node) => {
  //     node.data.selected = 'Yes'; // Update the selected column
  //     updatedData.push({ ...node.data }); // Store the updated row
  //   });

  //   // Use applyTransaction to update the grid
  //   this.api.applyTransaction({ update: updatedData });
  // }

  setSelectedToYes() {
    this.setSelectedToValue("yes")
  }

  setSelectedToBlank() {
    this.setSelectedToValue('')
  }
  setSelectedToValue(val) {
    let counter = 1; // Stavalrting value for the ID column

    // Iterate through rowData and set the 'id' column
    this.rowData.forEach((row, index) => {
      row.id = counter++;  // Increment the ID value
      row.selected = val;
      // Call the service to update the database
      this.dataService.updateData(
        row[this.table_name + "_id"],
        "selected",
        val,
        this.table_name,
        this.table_name,
        row[this.table_name + "_id"]
      ).subscribe();
      
    });

    console.log('Updated rowData:', this.rowData);

    // Apply the updated row data to the grid using applyTransaction
    const result = this.api.applyTransaction({ update: this.rowData });

    // Force the grid to refresh the cells
    this.api.refreshCells({ force: true });
    console.log('Transaction Result:', result);
  }
  // Function to set the "selected" column to blank for all rows
  // setSelectedToBlank() {

  //   const rowCount = this.api.getDisplayedRowCount(); // Get total number of displayed rows
  //   const allNodes = [];

  //   const updatedData = [];

  //   for (let i = 0; i < rowCount; i++) {
  //     const node = this.api.getDisplayedRowAtIndex(i); // Get node at each index
  //     node.data.selected = ''; // Set the selected column to an empty string
  //     updatedData.push({ ...node.data }); // Store the updated row
  //   }
  //   // // Get all rows and set the "selected" column to blank
  //   // this.api.forEachNode((node) => {
  //   //   node.data.selected = ''; // Set the selected column to an empty string
  //   //   updatedData.push({ ...node.data }); // Store the updated row
  //   // });

  //   // Use applyTransaction to update the grid
  //   this.api.applyTransaction({ update: updatedData });
  // }
}
