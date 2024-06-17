import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
  

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // private apiUrl = 'http://localhost:5000';
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}


  // Mock function to get table data
  // getTableData_dummy(): Observable<{ columns: string[], rows: any[] }> {
  //   const columns = ['id', 'name', 'age', 'address'];
  //   const rows = [
  //     { id: 1, name: 'John Doe', age: 25, address: '123 Main St' },
  //     { id: 2, name: 'Jane Smith', age: 30, address: '456 Maple Ave' },
  //     { id: 3, name: 'Sam Green', age: 22, address: '789 Oak Dr' }
  //   ];
  //   return of({ columns, rows });
  // }

  getTableData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get_campaign`);
  }

  updateData(id: number, column: string, value: any, table:string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/update`, { id, column, value , table});
  }

}
