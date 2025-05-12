import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import {
  PublicClientApplication,
  AuthenticationResult,
  AccountInfo,
} from '@azure/msal-browser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private msalService: MsalService) {}

  async login(): Promise<void> {
    const instance = this.msalService.instance as PublicClientApplication;

    // 👇 REQUIRED for MSAL v3+ if not using MsalModule.forRoot()
    await instance.initialize();

    const result = await instance.loginPopup({
      scopes: ['User.Read'],
    });

    const account = result.account;
    const domain = account?.username?.split('@')[1];

    if (domain !== 'zenexpartners.com') {
      alert('Access is restricted to zenexpartners.com accounts only.');
      await instance.logoutPopup(); // safer than redirect
    } else {
      instance.setActiveAccount(account);
      console.log('Login success:', account.username);
    }
  }

  logout(): void {
    this.msalService.logout();
  }

  isLoggedIn(): boolean {
    return !!this.msalService.instance.getActiveAccount();
  }

  async getToken(): Promise<string | null> {
    const instance = this.msalService.instance;
    const account = instance.getActiveAccount();
    if (!account) return null;

    try {
      const result = await instance.acquireTokenSilent({
        scopes: ['User.Read'],
        account,
      });
      return result.accessToken;
    } catch (err) {
      console.error('Token acquisition failed:', err);
      return null;
    }
  }

  getUserEmail(): string | null {
    const account: AccountInfo | null = this.msalService.instance.getActiveAccount();
    return account?.username ?? null;
  }
}
