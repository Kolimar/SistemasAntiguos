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

import { RegistrarIngresoComponent } from './components/registrar-ingreso/registrar-ingreso.component';
import { RegistrarEgresoComponent } from './components/registrar-egreso/registrar-egreso.component';
import { RegistrarRemisionComponent } from './components/registrar-remision/registrar-remision.component';
import { PanelContenedoresComponent } from './components/panel-contenedores/panel-contenedores.component';
import { PanelMovimientosComponent } from './components/panel-movimientos/panel-movimientos.component';
import { PanelBookingComponent } from './components/panel-booking/panel-booking.component';


export const ROUTES: Routes = [
  { path: 'login', component: LoginComponent },


  {path: '', redirectTo: 'dashboard', pathMatch: 'full',canActivate: [AuthGuard]},
  {path: '',component: FullLayoutComponent,
  data:
  { title: 'Home' },
  children: [
    { path: 'dashboard',component: DashboardComponent, canActivate: [AuthGuard]},
    { path: 'admcuentas', component: PanelusuariosComponent , canActivate: [AdminGuard,AuthGuard]},

    { path: 'ingresos', component: RegistrarIngresoComponent , canActivate: [AuthGuard]},
    { path: 'egresos', component: RegistrarEgresoComponent , canActivate: [AuthGuard]},
    { path: 'remisiones', component: RegistrarRemisionComponent , canActivate: [AuthGuard]},
    { path: 'contenedores', component: PanelContenedoresComponent , canActivate: [AuthGuard]},
    { path: 'movimientos', component: PanelMovimientosComponent , canActivate: [AuthGuard]},
    { path: 'booking', component: PanelBookingComponent , canActivate: [AuthGuard]},

    { path: 'perfil/:userId', component: PerfilComponent , canActivate: [AuthGuard]},
]},
  { path: '**', redirectTo:'' }

];

@NgModule({
  imports: [ RouterModule.forRoot(ROUTES) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
