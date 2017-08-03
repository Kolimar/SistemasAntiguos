import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//General components
import { LoginComponent } from './components/login/login.component';
import { AdminGuard,AuthGuard } from './services/guards/index';
// Layouts components
import { FullLayoutComponent } from './layouts/full-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
/* PERFIL OPERADOR*/
import { PerfilComponent } from './components/perfil/perfil.component';
//Admin components
import { PanelusuariosComponent } from './components/panelusuarios/panelusuarios.component';
/////////// Hay que crear un layout para el user basico.-
//////////////////////////
export const ROUTES: Routes = [
  { path: 'login', component: LoginComponent },


  {path: '', redirectTo: 'dashboard', pathMatch: 'full',canActivate: [AuthGuard]},
  {path: '',component: FullLayoutComponent,
  data:
  { title: 'Home' },
  children: [
    { path: 'dashboard',component: DashboardComponent, canActivate: [AuthGuard]},
    { path: 'admcuentas', component: PanelusuariosComponent , canActivate: [AdminGuard,AuthGuard]},
    { path: 'perfil/:userId', component: PerfilComponent , canActivate: [AuthGuard]},
]},
  { path: '**', redirectTo:'' }

];

@NgModule({
  imports: [ RouterModule.forRoot(ROUTES) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}