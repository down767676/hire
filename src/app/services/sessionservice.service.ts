import { Injectable } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive'
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SessionService {


  constructor(private auth: AuthService, private idle: Idle, private keepalive: Keepalive, private router: Router) {
     
    // Set idle time in seconds (3 hours)
    this.idle.setIdle(60*60*12);
   

    // Set timeout duration after idle period (e.g., 1 minute)
    this.idle.setTimeout(60*60*12);

    // Interrupts that reset the idle timer (clicks, scrolls, touches)
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    // On timeout warning (e.g., show countdown modal)
    this.idle.onTimeoutWarning.subscribe(countdown => {
      console.log(`You will be logged out in ${countdown} seconds`);
    });

    // On actual timeout
    this.idle.onTimeout.subscribe(() => {
      console.log('Logging out due to inactivity');
      this.logout(); // your logout method
    });
     this.idle.watch();

  }

logout() {
    // localStorage.clear();
    // this.router.navigate(['/login']);
    this. auth.logout()
}

}