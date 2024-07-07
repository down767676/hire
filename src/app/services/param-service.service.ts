import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParamService {
  private apiEndPoint: string = '';
  private sp: string = '';
  private tableName: string = '';
  private displayOnLoad: boolean = false;

  constructor() {}

  setApiEndPoint(apiEndPoint: string): void {
    this.apiEndPoint = apiEndPoint;
  }

  getApiEndPoint(): string {
    return this.apiEndPoint;
  }

  setSp(sp: string): void {
    this.sp = sp;
  }

  getSp(): string {
    return this.sp;
  }

  setTableName(tableName: string): void {
    this.tableName = tableName;
  }

  getTableName(): string {
    return this.tableName;
  }

  setDisplayOnLoad(displayOnLoad: boolean): void {
    this.displayOnLoad = displayOnLoad;
  }

  getDisplayOnLoad(): boolean {
    return this.displayOnLoad;
  }
}
