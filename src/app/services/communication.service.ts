import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private callJobJobApplicationTabShowGridSource = new Subject<void>();
  callJobJobApplicationTabShowGrid$ = this.callJobJobApplicationTabShowGridSource.asObservable();

  callJobJobApplicationTabShowGrid(data:any) {
    this.callJobJobApplicationTabShowGridSource.next(data);
  }
}
