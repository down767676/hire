import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private callJobJobApplicationTabShowGridSource = new Subject<void>();
  private callJobTabShowViewSource = new Subject<void>();
  callJobJobApplicationTabShowGrid$ = this.callJobJobApplicationTabShowGridSource.asObservable();
  callJobTabShowView$ = this.callJobTabShowViewSource.asObservable();

  callJobTabShowView(selectedView) {
    this.callJobTabShowViewSource.next(selectedView);
  }

  callJobJobApplicationTabShowGrid(data:any) {
    this.callJobJobApplicationTabShowGridSource.next(data);
  }
}
