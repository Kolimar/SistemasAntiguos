import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// APP PRINCIPAL
import { AppComponent } from './app.component';

// HOME Y LOGIN
import { HomeComponent } from './home/index';
import { LoginComponent } from './login/index';

// COMPONENTES TAREAS TEMPLATES
import { TareaTemplateComponent } from './tareas-templates/index';

// COMPONENETES SERVICIOS Y TAREAS TEMPLATES DE SERVICIOS
import { ServicioComponent } from './servicios/index';
import { ServicioTareaTemplateComponent } from './servicios/index';

// COMPONENETE TAREAS
import { TareaComponent } from './tareas/index';

// COMPONENETES LISTADO DE BRIEFS, CREACION Y EDICION
import { BriefComponent } from './briefs/index';
import { CreateBriefComponent } from './briefs/index';
import { EditBriefComponent } from './briefs/index';

// COMPONENETES LISTADO DE CLIENTES Y EDICION
import { ClienteComponent } from './clientes/index';
import { CreateClienteComponent } from './clientes/index';
import { EditClienteComponent } from './clientes/index';

// COMPONENETE ROLES DE CONTACTOS
import { RolContactoComponent } from './roles-contactos/index';

// COMPONENETE FORMAS DE PAGO
import { FormaPagoComponent } from './formas-pago/index';

// COMPONENETE CANALES DE ADQUISICION
import { CanalAdquisicionComponent } from './canales-adquisicion/index';

// COMPONENETE MOTIVOS DE LOG
import { MotivoLogComponent } from './motivos-logs/index';

// COMPONENETE TIPOS DE TAREAS
import { TipoTareaComponent } from './tipos-tareas/index';

// COMPONENETE USUARIOS
import { UserComponent } from './users/index';

// COMPONENETE LOGS
import { LogComponent } from './logs/index';

// COMPONENTE PANEL DE CLIENTES
import { PanelClienteComponent } from './panel-clientes/index';

// BRIEF DE PRIMERA REUNION
import { BriefPrimeraReunionComponent } from './briefs-primera-reunion/index';

import { RegisterComponent } from './register-user/index';
import { AuthGuard } from './guards/index';

const appRoutes: Routes = [
    { path: 'dashboard', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'tareas-templates', component: TareaTemplateComponent, canActivate: [AuthGuard] },
    { path: 'servicios', component: ServicioComponent, canActivate: [AuthGuard] },
    { path: 'servicios-tareas-templates/:id/:name', component: ServicioTareaTemplateComponent, canActivate: [AuthGuard] },
    { path: 'tareas', component: TareaComponent, canActivate: [AuthGuard] },
    { path: 'briefs', component: BriefComponent, canActivate: [AuthGuard] },
    { path: 'create-brief', component: CreateBriefComponent, canActivate: [AuthGuard] },
    { path: 'edit-brief/:id/:name', component: EditBriefComponent, canActivate: [AuthGuard] },
    { path: 'clientes', component: ClienteComponent, canActivate: [AuthGuard] },
    { path: 'create-cliente', component: CreateClienteComponent, canActivate: [AuthGuard] },
    { path: 'edit-cliente/:id/:name', component: EditClienteComponent, canActivate: [AuthGuard] },
    { path: 'roles-contactos', component: RolContactoComponent, canActivate: [AuthGuard] },
    { path: 'formas-pago', component: FormaPagoComponent, canActivate: [AuthGuard] },
    { path: 'canales-adquisicion', component: CanalAdquisicionComponent, canActivate: [AuthGuard] },
    { path: 'motivos-logs', component: MotivoLogComponent, canActivate: [AuthGuard] },
    { path: 'tipos-tareas', component: TipoTareaComponent, canActivate: [AuthGuard] },
    { path: 'users', component: UserComponent, canActivate: [AuthGuard] },
    { path: 'logs', component: LogComponent, canActivate: [AuthGuard] },
    { path: 'panel-clientes', component: PanelClienteComponent, canActivate: [AuthGuard] },
    { path: 'brief-primera-reunion/:id/:name', component: BriefPrimeraReunionComponent, canActivate: [AuthGuard] },

    // otherwise redirect to home
    { path: '**', redirectTo: 'dashboard' }
];

export const routing = RouterModule.forRoot(appRoutes);
