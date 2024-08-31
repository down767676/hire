export interface GridColumn {
    headerName: string;
    field: string;
    type: string;
    // cellRendererFramework: string;
    // cellEditorFramework: string;
    cellEditorParams: string;
    width: number;
    editable:boolean;
    option_sp_name: string;
    table: string;

    values?: string[]; // Optional property for dropdown values
  }
  
  export interface GridProperties {
    columns: GridColumn[];
  }
  