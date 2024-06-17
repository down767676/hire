// src/app/services/generic-data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'


@Injectable({
  providedIn: 'root'
})
export class GenericDataService {

  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  fetchData(api_end_point, sp, params: any): Observable<any> {
    let httpParams = new HttpParams();
    httpParams.append("sp",sp)
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, params[key]);
    });
    return this.http.get(`${this.apiUrl}/${api_end_point}`, { params: httpParams });
  }

  getTableData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get_campaign`);
  }

  updateData(id: number, column: string, value: any, table:string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/update`, { id, column, value , table});
  }

}
