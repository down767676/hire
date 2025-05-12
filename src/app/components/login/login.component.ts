import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private auth: AuthService, private router: Router) {}

  async login() {
    await this.auth.login();
    const isLoggedIn = this.auth.isLoggedIn();
    if (isLoggedIn) {
      this.router.navigate(['/app']);
    }
  }

  ngOnInit() {
  if (this.auth.isLoggedIn()) {
    this.router.navigate(['/app']);
  }
}

}