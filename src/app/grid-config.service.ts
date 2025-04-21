import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataService } from './data.service';
import { GridProperties } from './grid-properties.interface';
import { HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GridConfigService {

  private apiUrl = environment.apiUrl;
  private configUrl: string;
  private viewsUrl: string;

  constructor(private dataService: DataService, private http: HttpClient) { 
    this.configUrl = `${this.apiUrl}/grid-properties`;
    this.viewsUrl = `${this.apiUrl}/grid-views`;
  }

  getGridProperties(table_name:string): Observable<GridProperties> {
    let params = new HttpParams().set('table_name', table_name);
    return this.http.get<GridProperties>(this.configUrl, {params});
  }

  getGridViews(table_name:string): Observable<any[]> {
    let params = new HttpParams().set('table_name', table_name);
    var views = this.http.get<any[]>(this.viewsUrl, {params});
    return views
  }

  }
