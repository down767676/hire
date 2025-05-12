// src/app/msal-config.ts
import { PublicClientApplication } from '@azure/msal-browser';
import { environment } from './environments/environment';

export function MSALInstanceFactory() {
  return new PublicClientApplication({
    auth: {
      clientId: '13a74dae-bccc-430f-aa4c-98ddaf36ddf1',
      authority: 'https://login.microsoftonline.com/common',
      redirectUri:  environment.redirectUri
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: false
    }
  });
}
