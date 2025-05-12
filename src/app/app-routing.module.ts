import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; // ✅ Fix is here

import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MsalGuard } from '@azure/msal-angular';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'app', component: DashboardComponent, canActivate: [MsalGuard] },
  { path: '', redirectTo: 'app', pathMatch: 'full' },
  { path: '**', redirectTo: 'app' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
