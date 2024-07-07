import { Component, OnInit , Input, Inject} from '@angular/core';
import { GenericDataService } from '../services/generic-data.service';
import { ColDef, GridOptions, GridApi } from 'ag-grid-community';
import { GridConfigService } from '../grid-config.service';
import { GridProperties } from '../grid-properties.interface';
import { GridColumn } from '../grid-properties.interface';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ParamService } from 'src/app/services/param-service.service';



@Component({
  selector: 'app-dynamic-grid',
  templateUrl: './dynamic-grid.component.html',
  styleUrls: ['./dynamic-grid.component.css']
})
export class DynamicGridComponent implements OnInit {
  @Input()  gridOptions:GridOptions;
  @Input()  rowData:any[] = [];
  @Input()  columnDefs:ColDef[] = [];
  @Input()  defaultColDef = {
    editable: true,
    sortable: true,
    filter: true,
    resizable: true
  };

  @Input() table_name: string;
  @Input() api_end_point: string;
  @Input() sp: string;
  @Input() display_on_load: boolean;

 
  private isLoaded : Boolean
  private  isDataLoaded : boolean = false
  private gridInited: boolean
  // gridOptions!: GridOptions;
  public api!: GridApi;

  constructor(private dataService: GenericDataService, protected paramService:ParamService, protected garamService: ParamService, private gridConfigService: GridConfigService) {
    this.gridOptions = {
      onGridReady: (params) => this.onGridReady(params),
      onCellValueChanged: (event) => this.onCellValueChanged(event),
      rowSelection: 'multiple',  // Enable multiple row selection
      rowMultiSelectWithClick: true  // Allow multiple row selection with click
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

  setAttributes(params:any)
  {
    this.api_end_point = params.get("api_end_point", null)
    this.sp = params.get("sp", null)
    this.table_name = params.get("api_entable_named_point", null)
    this.display_on_load = params.get("api_end_point", null)
   }


  ngOnInit(): void {
    if (this.display_on_load)
    {
      this.loadGridColAndRows(null);
    }
    // this.getAttributes();
  }

  searchAndLoad(api_end_point, sp, params)
  {
    this.dataService.fetchData(api_end_point, sp, params).subscribe(data => {
      if (data.length > 0) {
        this.rowData = data;
        this.isDataLoaded = true;
        if (this.api) {
          this.api.updateGridOptions({ columnDefs: this.columnDefs});
          this.api.updateGridOptions({ rowData: this.rowData});
        }
      }
    });
  }  

  loadFromRows(rowData)
  {
    if (this.api) {
      this.rowData = rowData;
      this.api.updateGridOptions({ columnDefs: this.columnDefs});
      this.api.updateGridOptions({ rowData: this.rowData});
    }
  }  

  loadData(rowData) {
    if (rowData)
    {
      this.loadFromRows(rowData)
    }
    else
    {
      this.searchAndLoad(this.api_end_point, this.sp, {})
    }
  }

  
  loadGridColAndRows(rows:any) {
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
    this.loadData(rows)
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
