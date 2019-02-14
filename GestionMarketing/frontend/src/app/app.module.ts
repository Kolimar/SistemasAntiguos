import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ReactiveFormsModule, FormsModule  } from '@angular/forms';
import { HttpModule , Http} from '@angular/http';
import { AppComponent } from './app.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NAV_DROPDOWN_DIRECTIVES } from './shared/nav-dropdown.directive';
//servicios
import { UserService } from './services/users.service';
import { IotService } from './services/iot.service';
import { DetalleDispositivoService } from './services/detalle-dispositivo.service';
import { MyDateRangePickerModule } from 'mydaterangepicker';


import { AuthenticationService } from './services/authentication.service';
import { AdminGuard,AuthGuard } from './services/guards/index';
import {JsonpModule, Jsonp, Response} from '@angular/http';
import { AuthHttp, AuthConfig } from 'ng2-bearer';
// componentes externos
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TooltipModule,
         DropdownModule,
         FileUploadModule,
         DataTableModule,
         SharedModule,
         GrowlModule ,
       DataScrollerModule,ConfirmDialogModule,
ConfirmationService} from 'primeng/primeng';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SIDEBAR_TOGGLE_DIRECTIVES } from './shared/sidebar.directive';
import { AsideToggleDirective } from './shared/aside.directive';
import { BreadcrumbsComponent } from './shared/breadcrumb.component';
// Routing Module
import { AppRoutingModule } from './app.routing';
// Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';

//
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { CuentasComponent } from './components/cuentas/cuentas.component';
import { NuevoUsuarioComponent } from './components/nuevo-usuario/nuevo-usuario.component';
import { EditarUsuarioComponent } from './components/editar-usuario/editar-usuario.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { UserInfoPipe } from './pipes/user-info.pipe';
//dependencias
import {ToastyModule} from 'ng2-toasty';
import { PanelusuariosComponent } from './components/panelusuarios/panelusuarios.component';
import { ArraydeobjetosPipe } from './pipes/arraydeobjetos.pipe';
import { ListaDispositivosComponent } from './components/lista-dispositivos/lista-dispositivos.component';
import { CrearDispositivoComponent } from './components/crear-dispositivo/crear-dispositivo.component';
import { EditarDispositivoComponent } from './components/editar-dispositivo/editar-dispositivo.component';
import { PaneldispositivosComponent } from './components/paneldispositivos/paneldispositivos.component';
import { MedicionesComponent } from './components/mediciones/mediciones.component';
import { HistoricoComponent } from './components/historico/historico.component';
//modulos de chart 
import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { ChangePassComponent } from './components/change-pass/change-pass.component';

declare var require: any;
export function highchartsFactory() {
  return require('highcharts');
}


export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    headerName: 'Authorization',
    headerPrefix: 'Bearer',
    tokenName: 'IdUser',
    tokenGetter: (()=>localStorage.getItem('IdUser')),
    globalHeaders: [{'Content-Type':'application/json'}],
    noTokenError: true,
    noTokenScheme: true
  }), http);
}


@NgModule({
  imports: [
    DataScrollerModule,
    MyDateRangePickerModule,
    ConfirmDialogModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    TooltipModule,
    DropdownModule,
    DataTableModule,
    SharedModule,
    FileUploadModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ToastyModule.forRoot(),
    ChartsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
    ChartModule,
    JsonpModule,
    GrowlModule,

  ],
  declarations: [
    DashboardComponent,
    AppComponent,
    FullLayoutComponent,
    NAV_DROPDOWN_DIRECTIVES,
    BreadcrumbsComponent,
    SIDEBAR_TOGGLE_DIRECTIVES,
    AsideToggleDirective,
    LoginComponent,
    CuentasComponent,
    NuevoUsuarioComponent,
    EditarUsuarioComponent,
    PerfilComponent,
    UserInfoPipe,
    PanelusuariosComponent,
    ArraydeobjetosPipe,
    ListaDispositivosComponent,
    CrearDispositivoComponent,
    EditarDispositivoComponent,
    PaneldispositivosComponent,
    MedicionesComponent,
    HistoricoComponent,
    ChangePassComponent
  ],
  providers: [
  ConfirmationService,
  AuthenticationService,
  UserService,
  IotService,
  DetalleDispositivoService,
  AuthGuard,
  AdminGuard,
  {
      provide: HighchartsStatic,
      useFactory: highchartsFactory
  },
  {  provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [Http]
    },
  {
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  }],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
