import { formatDate } from '@angular/common';
import { Component, OnInit, Input, Inject, numberAttribute, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { GenericDataService } from '../services/generic-data.service';
import { ColDef, GridOptions, GridApi } from 'ag-grid-community';
import { GridConfigService } from '../grid-config.service';
import { GridProperties } from '../grid-properties.interface';
// import 'ag-grid-enterprise';

import { GridColumn } from '../grid-properties.interface';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ParamService } from 'src/app/services/param-service.service';
import { MultiSelectDropdownComponent } from '../components/multi-select-dropdown/multi-select-dropdown.component';
import { ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';
import { MaterialDateEditorComponent } from '../components/material-date-editor/material-date-editor.component'
import { MatDialog } from '@angular/material/dialog';
import { EditHtmlDialogComponent } from '../components/edit-html-dialog/edit-html-dialog.component';
import { AgGridModule } from 'ag-grid-angular';
// ../multi-select-dropdown/multi-select-dropdown.component'

function stripHtml(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

@Component({
  selector: 'app-dynamic-grid',
  templateUrl: './dynamic-grid.component.html',
  styleUrls: ['./dynamic-grid.component.css'],
  encapsulation: ViewEncapsulation.None,
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

  @Input() clearOtherRowsOnSelect: boolean = true;
  @Input() updateSelectedColumn: boolean = false;
  @Input() table_name: string;
  @Input() view_name: string;
  @Input() api_end_point: string;
  @Input() sp: string;
  @Input() display_on_load: boolean;
  @Output() notify = new EventEmitter<void>();
  public isMobile = window.innerWidth < 960;
  multiSelectLabel: string = 'Multi Select';


  funnelSvg = `
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
       xmlns="http://www.w3.org/2000/svg">
    <path d="M3 4h18l-7 10v6l-4 0v-6z"/>
  </svg>
`;

  onCellEditingStopped(event: any) {
    // Check if the parameter to clear other rows is enabled
    if (
      this.clearOtherRowsOnSelect &&
      event.column.getColId() === 'selected' &&
      event.node.data.selected === 'yes'
    ) {
      this.api.forEachNode((node: any) => {
        // Only clear other rows, not the one that triggered the event
        if (node.rowIndex !== event.node.rowIndex) {
          node.setDataValue('selected', null);
        }
      });
    }
  }

  selectedView = null;
  showPinnedRow = false
  pinnedBottomRowData = []
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

  constructor(
    private http: HttpClient,
    private dataService: GenericDataService,
    protected paramService: ParamService,
    protected garamService: ParamService,
    private gridConfigService: GridConfigService,
    private dialog: MatDialog
  ) {
    this.gridOptions = {
      onGridReady: (params) => this.onGridReady(params),
      stopEditingWhenCellsLoseFocus: true,
      onCellValueChanged: (event) => this.onCellValueChanged(event),
      onCellEditingStopped: this.onCellEditingStopped.bind(this),
      context: {
        componentParent: this
      },

      rowSelection: 'single',
      defaultColDef: {
        filter: true
      },
      icons: {
        menu: this.funnelSvg
      }
    };
  }

  clearOnCellValueChanged(event: any) {
    // Check if the parameter to clear other rows is enabled, and the `selected` column was changed to 'yes'
    if (
      this.clearOtherRowsOnSelect &&
      event.column.getColId() === 'selected' &&
      event.newValue === 'yes'
    ) {
      this.api.forEachNode((node: any) => {
        // Only clear other rows, not the one that triggered the event
        if (node.rowIndex !== event.node.rowIndex) {
          node.setDataValue('selected', null);
        }
      });
    }
  }

  // getAttributes()
  // {
  //   this.api_end_point = this.paramService.getApiEndPoint();
  //   this.sp = this.paramService.getSp();

  //   this.table_name = this.paramService.getTableName();
  //   this.display_on_load = this.paramService.getDisplayOnLoad()
  // }


  // dateComparator(date1: string, date2: string): number {
  //   // Attempt to parse the dates
  //   const dateObj1 = Date.parse(date1);
  //   const dateObj2 = Date.parse(date2);

  //   // Handle invalid dates
  //   if (isNaN(dateObj1) && isNaN(dateObj2)) {
  //     console.error('Invalid date format:', date1, date2);
  //     return 0  // Treat invalid dates as equal
  //   }
  //   else if (isNaN(dateObj1) && !isNaN(dateObj2)) {
  //     console.error('Invalid date format:', date1, date2);
  //     return 1  // Treat invalid dates as equal
  //   }
  //   else if (!isNaN(dateObj1) && isNaN(dateObj2)) {
  //     console.error('Invalid date format:', date1, date2);
  //     return -1  // Treat invalid dates as equal
  //   }

  //   // Compare the timestamps
  //   if (dateObj1 < dateObj2) {
  //     return -1;
  //   }
  //   if (dateObj1 > dateObj2) {
  //     return 1;
  //   }
  //   return 0;
  // }

  pinRow(pinnedBottomRowData: any[]) {
    this.showPinnedRow = true;
    this.pinnedBottomRowData = pinnedBottomRowData;
  }

  setAttributes(params: any) {
    this.api_end_point = params.get("api_end_point", null)
    this.sp = params.get("sp", null)
    this.table_name = params.get("api_entable_named_point", null)
    this.display_on_load = params.get("display_on_load", null)
  }

  loadGridViews() {
    var view_name = null
    if (this.view_name) {
      view_name = this.view_name
    }
    else {
      view_name = this.table_name
    }
    this.gridConfigService.getGridViews(view_name).subscribe(data => {
      this.views = data["views"];
      this.selectedView = this.views[0].file
    });

  }

  public setSelectedView(selectedViewName) {
    this.selectedView = selectedViewName;
    this.onViewSelect(this.selectedView)
  }
  ngOnInit(): void {
    if (this.display_on_load) {
      this.loadGridColAndRows(null);
    }
    this.loadGridViews();
    // this.getAttributes();

    // Expose methods to window for ball click handling
    (window as any).cyclePriority = this.cyclePriority.bind(this);
    (window as any).toggleNotifyRecruiter = this.toggleNotifyRecruiter.bind(this);
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
        this.notify.emit();

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
  // setIncrementalIds() {
  //   let counter = 1; // Starting value for the ID column

  //   // Iterate through rowData and set the 'id' column
  //   this.rowData.forEach((row, index) => {
  //     row.id = counter++;  // Increment the ID value
  //   });

  //   console.log('Updated rowData:', this.rowData);

  //   // Apply the updated row data to the grid using applyTransaction
  //   const result = this.api.applyTransaction({ update: this.rowData });

  //   // Force the grid to refresh the cells
  //   this.api.refreshCells({ force: true });
  //   console.log('Transaction Result:', result);
  // }
  loadData(rowData) {
    if (rowData) {
      this.loadFromRows(rowData)
      this.notify.emit();
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

  loadGridColAndRows(rows: any) {
    var view_name = null
    if (this.view_name) {
      view_name = this.view_name
    }
    else {
      view_name = this.table_name
    }

    this.loadGridColAndRowsHelper(rows, view_name, true);
  }

  dateFormatter(params) {
    if (!params.value) {
      return null;
    }
    return formatDate(params.value, 'MM-dd-yyyy', 'en-US');
  }

  dateComparator(date1: string, date2: string): number {
    const d1 = new Date(date1).getTime();
    const d2 = new Date(date2).getTime();
    return d1 - d2;
  }

  loadGridColAndRowsHelper(rows: any, view_name: string, loadData: boolean) {
    if (view_name == null) {
      view_name = this.table_name;
    }
    this.gridConfigService.getGridProperties(view_name).subscribe((data: GridProperties) => {
      this.view_name = view_name;
      let cb = false;
      const columnDefCheckBox: ColDef = {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        width: 50,
        pinned: 'left'
      };

      this.columnDefs = data.columns.map((col: GridColumn) => {
        const columnDef: ColDef = {
          headerName: col.headerName,
          field: col.field,
          width: col.width,
          editable: col.editable
        };

        if (col.table) {
          columnDef["table"] = col.table;
        }

        switch (col.type) {
          case 'email':
            columnDef.cellRenderer = (params) => {
              if (!params.value) return '';
              return `<a href="mailto:${params.value}">${params.value}</a>`;
            };
            break;
          case 'text':
            columnDef.cellEditor = 'agTextCellEditor';
            columnDef.filter = "agTextColumnFilter";
            break;
          case 'number':
            columnDef.cellEditor = 'agNumberCellEditor';
            columnDef.filter = "agNumberColumnFilter";
            break;
          case 'date':
            columnDef.cellEditor = MaterialDateEditorComponent;
            columnDef.filter = 'agDateColumnFilter';
            columnDef.sortable = true;
            columnDef.editable = true;
            columnDef.cellEditorPopup = true;
            columnDef.cellDataType = 'date';
            columnDef.comparator = this.dateComparator;
            columnDef.valueFormatter = (params) => {
              if (!params.value) return '';
              const date = new Date(params.value);
              if (isNaN(date.getTime())) return params.value;
              const yy = String(date.getFullYear());
              const mm = String(date.getMonth() + 1).padStart(2, '0');
              const dd = String(date.getDate()).padStart(2, '0');
              return `${yy}-${mm}-${dd}`;
            };
            columnDef.filterParams = {
              comparator: (filterDate: Date, cellValue: any) => {
                const parsed = new Date(cellValue);
                if (isNaN(parsed.getTime())) return -1;
                const d1 = new Date(filterDate.setHours(0, 0, 0, 0));
                const d2 = new Date(parsed.setHours(0, 0, 0, 0));
                return d1 < d2 ? -1 : d1 > d2 ? 1 : 0;
              }
            };
            break;
          case 'boolean':
            columnDef.cellEditor = 'agCheckboxCellEditor';
            columnDef.cellRenderer = 'agCheckboxCellRenderer';
            break;
          case 'dropdown':
            columnDef.cellEditor = 'agSelectCellEditor';
            columnDef.cellEditorParams = { values: col.values };

            // Add color styling for priority field
            if (col.field === 'priority') {
              columnDef.cellStyle = (params) => {
                const priority = params.value;
                let backgroundColor = '#F3F4F6'; // Light gray for no priority
                let color = '#374151'; // Dark gray text

                if (priority === 'low') {
                  backgroundColor = '#FEF3C7'; // Light yellow
                  color = '#92400E'; // Dark yellow text
                } else if (priority === 'high') {
                  backgroundColor = '#FED7AA'; // Light orange
                  color = '#9A3412'; // Dark orange text
                } else if (priority === 'urgent') {
                  backgroundColor = '#DC2626'; // Solid red
                  color = '#FFFFFF'; // White text
                }

                return {
                  backgroundColor,
                  color,
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                };
              };
            }

            // Add color styling for notify_recruiter_on_next_reply (CR) field
            if (col.field === 'notify_recruiter_on_next_reply') {
              columnDef.cellStyle = (params) => {
                const value = params.value;
                let backgroundColor = '#F3F4F6'; // Light gray for no/empty
                let color = '#374151'; // Dark gray text

                if (value === 'yes' || value === true || value === 1) {
                  backgroundColor = '#D1FAE5'; // Light green
                  color = '#065F46'; // Dark green text
                }

                return {
                  backgroundColor,
                  color,
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                };
              };

              // Format the display value
              columnDef.valueFormatter = (params) => {
                const value = params.value;
                if (value === true || value === 1 || value === 'yes') {
                  return 'Yes';
                } else if (value === false || value === 0 || value === 'no') {
                  return 'No';
                }
                return '';
              };
            }
            break;
          case 'checkbox':
            cb = true;
            break;
          case 'ball':
            columnDef.cellRenderer = (params) => {
              const fieldName = params.colDef.field;

              // Special handling for priority field
              if (fieldName === 'priority') {
                const priority = params.value;
                let color = '#9CA3AF'; // Gray for no priority
                let title = 'No priority - click to cycle';

                if (priority === 'low') {
                  color = '#EAB308'; // Yellow
                  title = 'Low priority - click to cycle';
                } else if (priority === 'high') {
                  color = '#F97316'; // Orange
                  title = 'High priority - click to cycle';
                } else if (priority === 'urgent') {
                  color = '#DC2626'; // Red
                  title = 'Urgent - click to cycle';
                }

                const jobApplicationId = params.data.jobapplication_id;
                return `
                  <div style="display: flex; align-items: center; justify-content: center; height: 100%; cursor: pointer;"
                       onclick="window.cyclePriority(${jobApplicationId}, event)">
                    <div style="
                      width: 12px;
                      height: 12px;
                      border-radius: 50%;
                      background-color: ${color};
                      box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
                    " title="${title}"></div>
                  </div>
                `;
              }

              // Special handling for notify_recruiter_on_next_reply field
              if (fieldName === 'notify_recruiter_on_next_reply') {
                if (params.value) {
                  const color = col.color || 'green';
                  const jobApplicationId = params.data.jobapplication_id;
                  return `
                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; cursor: pointer;"
                         onclick="window.toggleNotifyRecruiter(${jobApplicationId}, event)">
                      <div style="
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background-color: ${color};
                        box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
                      " title="Candidate replied - click to deactivate notification"></div>
                    </div>
                  `;
                }
                return ''; // Empty if no value
              }

              // Default ball rendering for other ball-type fields
              if (params.value) {
                const color = col.color || 'green';
                return `
                  <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
                    <div style="
                      width: 12px;
                      height: 12px;
                      border-radius: 50%;
                      background-color: ${color};
                      box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
                    "></div>
                  </div>
                `;
              }
              return ''; // Empty if no value
            };
            columnDef.editable = false;
            break;
          case 'url':
            columnDef.cellRenderer = (params) => {
              if (!params.value) return '';
              return `<a href="${params.value}" target="_blank" rel="noopener noreferrer">Link</a>`;
            }
          case 'multi-select-dropdown':
            columnDef.cellEditor = MultiSelectDropdownComponent;
            columnDef.editable = true;
            columnDef.cellEditorParams = {
              procName: col.option_sp_name,
              codes: ['1', '2']
            };
            break;
          case 'html':
            columnDef.cellRenderer = (params) => {
              const div = document.createElement('div');

              // Preview plain text
              const html = params.value || '';
              const preview = stripHtml(html);
              const truncated = preview.length > 40 ? preview.slice(0, 40) + '…' : preview;

              div.innerHTML = `
  <div style="display: flex; align-items: center; width: 100%;">
    <button style="flex-shrink: 0; margin-right: 6px; padding: 2px 6px;">…</button>
    <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex-grow: 1;">
      ${truncated}
    </span>
  </div>
`;


              // Button click to edit
              const btn = div.querySelector('button');
              btn?.addEventListener('click', () => {
                // Fetch latest value from database before opening dialog
                const componentParent = params.context.componentParent;
                const recordId = params.data[componentParent.table_name + "_id"];
                const fieldName = params.colDef.field;

                console.log('Fetching latest value:', { recordId, fieldName, table: componentParent.table_name });

                componentParent.dataService.getFieldValue(recordId, fieldName, componentParent.table_name)
                  .subscribe({
                    next: (response) => {
                      console.log('Database response:', response);
                      // Handle different possible response formats
                      let latestValue = '';
                      if (Array.isArray(response) && response.length > 0) {
                        latestValue = response[0][fieldName] || '';
                      } else if (response && typeof response === 'object') {
                        latestValue = response.value || response[fieldName] || '';
                      } else {
                        latestValue = response || '';
                      }

                      const dialogRef = componentParent.dialog.open(EditHtmlDialogComponent, {
                        width: '700px',
                        data: { value: latestValue }
                      });

                      dialogRef.afterClosed().subscribe(result => {
                        if (result != null) {
                          params.node.setDataValue(params.colDef.field, result);

                          // Save via service
                          componentParent.saveToBackend(
                            recordId,
                            params.colDef.field,
                            result
                          );
                        }
                      });
                    },
                    error: (error) => {
                      console.error('Error fetching latest value:', error);
                      // Fallback to cached value if fetch fails
                      const dialogRef = componentParent.dialog.open(EditHtmlDialogComponent, {
                        width: '700px',
                        data: { value: params.value || '' }
                      });

                      dialogRef.afterClosed().subscribe(result => {
                        if (result != null) {
                          params.node.setDataValue(params.colDef.field, result);

                          // Save via service
                          componentParent.saveToBackend(
                            recordId,
                            params.colDef.field,
                            result
                          );
                        }
                      });
                    }
                  });
              });

              return div;
            };
            columnDef.editable = false;
            break;


        }

        return columnDef;
      });

      if (cb) {
        this.columnDefs.push(columnDefCheckBox);
        if (this.api) {
          this.api.setGridOption('columnDefs', this.columnDefs);
        }
      }

      if (loadData) {
        this.loadData(rows);
      }
    });
  }


  frameworkComponents = {
    multiSelectDropdownComponent: MultiSelectDropdownComponent,
    materialDateEditor: MaterialDateEditorComponent,
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

  
  setSelectedToValue(val) {
    let counter = 1; // Stavalrting value for the ID column

    // Iterate through rowData and set the 'id' column
    this.rowData.forEach((row, index) => {
      row.id = counter++;  // Increment the ID value
      row.selected = val;
      // Call the service to update the database
      //   this.dataService.updateData(
      //     row[this.table_name + "_id"],
      //     "selected",
      //     val,
      //     this.table_name,
      //     this.table_name,
      //     row[this.table_name + "_id"]
      //   ).subscribe();

    });

    console.log('Updated rowData:', this.rowData);

    // Apply the updated row data to the grid using applyTransaction
    const result = this.api.applyTransaction({ update: this.rowData });

    // Force the grid to refresh the cells
    this.api.refreshCells({ force: true });
    console.log('Transaction Result:', result);
  }

  setSelectedToValue_2(selectedValue: string) {
    this.api.forEachNodeAfterFilter((node) => {
      const job = node.data;

      // Set the selected field to the desired value for filtered rows
      job.selected = selectedValue;

      // Call the service to update the database
      // this.dataService.updateData(
      //   job[this.table_name + "_id"],
      //   "selected",
      //   selectedValue,
      //   this.table_name,
      //   this.table_name,
      //   job[this.table_name + "_id"]
      // ).subscribe();

      // Apply the updated row data to the grid using applyTransaction
      const result = this.api.applyTransaction({ update: this.rowData });

      // Force the grid to refresh the cells
    })
    this.api.refreshCells({ force: true });
    //  console.log('Transaction Result:', result);
  };
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
    if (this.updateSelectedColumn == false && event.column.getColId() === 'selected') {
      return;
    }
    const { data, colDef, newValue } = event;

    // Special handling for priority field using Flask endpoint
    if (colDef.field === 'priority' && this.table_name === 'jobapplication') {
      const conversationId = data.conversation_id || data.jobapplication_id;

      this.dataService.fetchDataPost('/api/recruiter/update_priority', null, {
        conversation_id: conversationId,
        priority: newValue || null
      }).subscribe({
        next: (response) => {
          console.log('Priority updated successfully:', response);
        },
        error: (error) => {
          console.error('Error updating priority:', error);
          alert('Failed to update priority');
        }
      });
      return;
    }

    // Special handling for notify_recruiter_on_next_reply field using stored procedure
    if (colDef.field === 'notify_recruiter_on_next_reply' && this.table_name === 'jobapplication') {
      // Convert yes/no to 1/0
      const notifyValue = (newValue === 'yes' || newValue === true || newValue === 1) ? 1 : 0;

      this.dataService.fetchDataPost('execute_stored_procedure', 'sp_UpdateNotifyRecruiterOnNextReply', {
        jobapplication_id: data.jobapplication_id,
        notify_recruiter_on_next_reply: notifyValue
      }).subscribe({
        next: (response) => {
          console.log('Notification setting updated successfully:', response);
        },
        error: (error) => {
          console.error('Error updating notification setting:', error);
          alert('Failed to update notification setting');
        }
      });
      return;
    }

    // Default handling for other fields
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
    this.setSelectedToValue_2("yes")
  }

  clearFilters() {
    this.api.setFilterModel(null);
  }
  setSelectedToBlank() {
    this.setSelectedToValue_2('')
  }

  multiSelect()
  {
      this.clearOtherRowsOnSelect = !this.clearOtherRowsOnSelect;
    this.multiSelectLabel = this.clearOtherRowsOnSelect ? 'Multi Select' : 'Single Select';

  }
  // Function to Add a New Row
  addRow() {
    if (!this.table_name) {
      console.error('Table name is required.');
      return;
    }

    // Identify the column to update: table_name + "_id"
    const idColumnName = `${this.table_name}_id`;

    // Check if the id column exists in column definitions
    const columnExists = this.columnDefs.some((col) => col.field === idColumnName);

    if (!columnExists) {
      console.error(`Column '${idColumnName}' does not exist in the grid.`);
      return;
    }

    this.dataService.fetchDataPost('insert_row', null, { table_name: this.table_name }).subscribe(response => {
      if (response && response.table_id) {
        // Create a new row with the table_id in the correct column
        const newRow: any = { [idColumnName]: response.table_id };

        // Add the new row to AG-Grid
        this.rowData = [...this.rowData, newRow];
      }
    },
      (error) => {
        console.error('Error adding row:', error);
      }
    )
  }

  public clearAllRows(): void {
    this.rowData = []; // Clear local data model

    if (this.api) {
      // Preferred method to update grid data
      this.api.setGridOption('rowData', []);
      // Optional: update filtered row count if you're tracking it
      this.updateFilteredRowCount();
      this.isDataLoaded = false;
    }
  }
  saveToBackend(jobId: number, columnName: string, value: string): void {
    this.dataService.updateData(jobId, columnName, value, this.table_name, null, null).subscribe();
  }


  // Function to set the "selected" column to blank for all rows
  // setSelectedToBlank() {

  //   const rowCount = this.api.getDisplayedRowCount(); // Get total number of displayed rows
  //   const allNodes = [];

  //   const updatedData = [];

  //   for (let i = 0; i < rowCount; i++) {
  //     const node = this.api.getDisplayedRowAtIndex(i); // Get node at each index
  //     node.data.selected = ''; // Set the selecngted column to an empty string
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

  // Priority cycling function for jobapplication dashboard
  cyclePriority(jobApplicationId: number, event: Event): void {
    // Stop event propagation
    if (event) {
      event.stopPropagation();
    }

    // Find the row node by iterating through all nodes
    let targetNode: any = null;
    let currentPriority = '';

    this.api.forEachNode((node) => {
      if (node.data.jobapplication_id == jobApplicationId) {
        targetNode = node;
        currentPriority = node.data.priority || '';
      }
    });

    if (!targetNode) {
      console.error(`No node found for jobapplication_id: ${jobApplicationId}`);
      return;
    }

    // Define cycle: null -> low -> high -> urgent -> null
    const cycle: { [key: string]: string } = {
      '': 'low',
      'low': 'high',
      'high': 'urgent',
      'urgent': ''
    };

    const newPriority = cycle[currentPriority];

    // Call stored procedure via fetchDataPost
    this.dataService.fetchDataPost('execute_stored_procedure', 'sp_UpdateConversationPriority', {
      jobapplication_id: jobApplicationId,
      priority: newPriority || null
    }).subscribe({
      next: (response) => {
        console.log('Priority updated successfully:', response);

        // Update the underlying data object directly
        targetNode.data.priority = newPriority;

        // Refresh the specific cell to show the new priority color
        this.api.refreshCells({
          rowNodes: [targetNode],
          columns: ['priority'],
          force: true
        });

        const priorityLabel = newPriority ? newPriority.charAt(0).toUpperCase() + newPriority.slice(1) : 'None';
        console.log(`Priority updated to: ${priorityLabel}`);
      },
      error: (error) => {
        console.error('Error updating priority:', error);
        alert('Failed to update priority');
      }
    });
  }

  // Toggle notify_recruiter_on_next_reply function for jobapplication dashboard
  toggleNotifyRecruiter(jobApplicationId: number, event: Event): void {
    // Stop event propagation
    if (event) {
      event.stopPropagation();
    }

    // Find the row node by iterating through all nodes
    let targetNode: any = null;

    this.api.forEachNode((node) => {
      if (node.data.jobapplication_id == jobApplicationId) {
        targetNode = node;
      }
    });

    if (!targetNode) {
      console.error(`No node found for jobapplication_id: ${jobApplicationId}`);
      return;
    }

    // Call stored procedure to set notify_recruiter_on_next_reply to false (0)
    this.dataService.fetchDataPost('execute_stored_procedure', 'sp_UpdateNotifyRecruiterOnNextReply', {
      jobapplication_id: jobApplicationId,
      notify_recruiter_on_next_reply: 0
    }).subscribe({
      next: (response) => {
        console.log('Notification deactivated successfully:', response);

        // Update the underlying data object directly
        targetNode.data.notify_recruiter_on_next_reply = false;

        // Refresh the specific cell to hide the ball
        this.api.refreshCells({
          rowNodes: [targetNode],
          columns: ['notify_recruiter_on_next_reply'],
          force: true
        });

        console.log('Candidate reply notification deactivated');
      },
      error: (error) => {
        console.error('Error deactivating notification:', error);
        alert('Failed to deactivate notification');
      }
    });
  }
}
