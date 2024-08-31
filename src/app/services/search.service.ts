import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Generic search function
  search(params): Observable<any> {
    return this.http.post(`${this.apiUrl}/search`,  params );
  }
}
