export interface GridColumn {
    headerName: string;
    field: string;
    type: string;
    width: number;
    editable:boolean;
    values?: string[]; // Optional property for dropdown values
  }
  
  export interface GridProperties {
    columns: GridColumn[];
  }
  