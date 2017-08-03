import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// APP PRINCIPAL
import { AppComponent } from './app.component';

// HOME, REGISTRO USUARIOS Y LOGIN
import { HomeComponent } from './home/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register-user/index';

// PRESTACIONES
import { PrestacionComponent } from './prestaciones/index';

//OBRAS SOCIALES
import { ObraSocialComponent } from './obras-sociales/index';

// DOCTORES
import { DoctorComponent } from './doctores/index';
import { VisitaComponent } from './doctores/visitas/index';

// PARTICULARES
import { ParticularComponent } from './particulares/index';

// PACIENTES
import { PacienteComponent } from './pacientes/index';

// INGRESO DE GASTOS
import { IngresoGastoComponent } from './ingresos-gastos/index';

// ESTUDIOS
import { EstudioComponent } from './estudios/index';

import { AuthGuard } 				from './guards/index';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'prestaciones', component: PrestacionComponent, canActivate: [AuthGuard] },
    { path: 'obras-sociales', component: ObraSocialComponent, canActivate: [AuthGuard] },
    { path: 'doctores', component: DoctorComponent, canActivate: [AuthGuard] },
    { path: 'visitas/:id/:name/:lastname', component: VisitaComponent, canActivate: [AuthGuard] },
    { path: 'particulares', component: ParticularComponent, canActivate: [AuthGuard] },
    { path: 'pacientes', component: PacienteComponent, canActivate: [AuthGuard] },
    { path: 'ingresos-de-gastos', component: IngresoGastoComponent, canActivate: [AuthGuard] },
    { path: 'estudios', component: EstudioComponent, canActivate: [AuthGuard] },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
