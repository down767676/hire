import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  // Create a Subject to hold and emit the data
  private dataSubject = new Subject<any>();

  // Expose the observable part of the Subject
  data$ = this.dataSubject.asObservable();

  // Method to update the value of the Subject
  setData(data: any) {
    this.dataSubject.next(data);
  }
}
