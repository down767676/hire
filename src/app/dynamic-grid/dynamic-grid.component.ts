import { Component, OnInit , Input} from '@angular/core';
import { GenericDataService } from '../services/generic-data.service';
import { ColDef, GridOptions, GridApi } from 'ag-grid-community';
import { GridConfigService } from '../grid-config.service';
import { GridProperties } from '../grid-properties.interface';
import { GridColumn } from '../grid-properties.interface';


@Component({
  selector: 'app-dynamic-grid',
  templateUrl: './dynamic-grid.component.html',
  styleUrls: ['./dynamic-grid.component.css']
})
export class DynamicGridComponent implements OnInit {
  @Input()  table_name:string;
  @Input()  api_end_point:string;
  @Input()  sp:string;
  columnDefs: ColDef[] = [];
  rowData: any[] = [];
  isDataLoaded = false;
  gridInited = false;
  defaultColDef = {
    editable: true,
    sortable: true,
    filter: true,
    resizable: true
  };
  
  gridOptions!: GridOptions;
  private api!: GridApi;

  constructor(private dataService: GenericDataService, private gridConfigService: GridConfigService) {
    this.gridOptions = {
      onGridReady: (params) => this.onGridReady(params),
      onCellValueChanged: (event) => this.onCellValueChanged(event),
      rowSelection: 'multiple',  // Enable multiple row selection
      rowMultiSelectWithClick: true  // Allow multiple row selection with click
      // onSelectionChanged: this.onSelectionChanged.bind(this)  // Bind the selection change event
    };
  }

  ngOnInit(): void {
    this.loadColumnProperties();
  }

  loadData() {
    // Load data
    this.dataService.fetchData(this.api_end_point, this.sp, {}).subscribe(data => {
      if (data.length > 0) {
        // this.columnDefs = Object.keys(data[0]).map(key => ({ headerName: key, field: key, editable: true }));
        this.rowData = data;
        this.isDataLoaded = true;
        // If the grid is already ready, set the data
        if (this.api) {
          this.api.updateGridOptions({ columnDefs: this.columnDefs});
          this.api.updateGridOptions({ rowData: this.rowData});
          // this.api.setColumnDefs(this.columnDefs);
          // this.api.setRowData(this.rowData);
        }
      }
    });
  }

  loadColumnProperties() {
    this.gridConfigService.getGridProperties(this.table_name).subscribe((data: GridProperties) => {
      const  columnDefCheckBox :ColDef =     {
        headerCheckboxSelection: true,  // Display checkbox in the header
        checkboxSelection: true,        // Display checkbox in each row
        headerCheckboxSelectionFilteredOnly: true, // Display header checkbox for only filtered rows
        width: 50,
        pinned: 'left'  // Pin the checkbox column to the left
      }
      this.columnDefs = data.columns.map((col: GridColumn) => {
        const  columnDef: ColDef = {
          headerName: col.headerName,
          field: col.field,
          width: col.width,
          editable : col.editable
        };

        if (col.type === 'text') {
          columnDef.cellEditor = 'agTextCellEditor';
        } else if (col.type === 'number') {
          columnDef.cellEditor = 'agNumberCellEditor';
        }else if (col.type === 'date') {
          columnDef.cellEditor = 'agDateCellEditor';
        } 
        else if (col.type === 'dropdown') {
          columnDef.cellEditor = 'agSelectCellEditor';
          columnDef.cellEditorParams = {
            values: col.values
          };
        }

        return columnDef;
      }
    );
    this.columnDefs.push(columnDefCheckBox)
    this.loadData()
    }
    );
    }


  onGridReady(params: any) {
    this.gridInited = true;
    this.api = params.api;
    if (this.isDataLoaded) {
      params.api.setColumnDefs(this.columnDefs);
      params.api.setRowData(this.rowData);
    }
  }

  onCellValueChanged(event: any) {
    const { data, colDef, newValue } = event;
    this.dataService.updateData(data[this.table_name + "_id"], colDef.field, newValue, this.table_name).subscribe();
  }
}
