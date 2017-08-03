import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ReactiveFormsModule, FormsModule  } from '@angular/forms';
import { HttpModule , Http, JsonpModule, Jsonp, Response} from '@angular/http';
import { AppComponent } from './app.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NAV_DROPDOWN_DIRECTIVES } from './shared/nav-dropdown.directive';
//servicios
import { MovimientosService } from './services/movimientos.service';
import { UserService } from './services/users.service';
import { BookingService } from './services/booking.service';

import { ContenedorService } from './services/contenedor.service';
import { AuthenticationService } from './services/authentication.service';
import { AdminGuard,AuthGuard } from './services/guards/index';
// componentes externos

import { AuthHttp, AuthConfig } from 'ng2-bearer';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TooltipModule,
         DropdownModule,
         FileUploadModule,
         DataTableModule,
         SharedModule,
         GrowlModule ,
       DataScrollerModule,
       ConfirmDialogModule,
ConfirmationService,
DialogModule} from 'primeng/primeng';
import { SIDEBAR_TOGGLE_DIRECTIVES } from './shared/sidebar.directive';
import { AsideToggleDirective } from './shared/aside.directive';
import { BreadcrumbsComponent } from './shared/breadcrumb.component';
// Routing Module
import { AppRoutingModule } from './app.routing';
// Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';
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
////////////////////////

/* HASTA ACA SON LOS MODULOS DE USER*/

////////////////////////

import { RegistrarIngresoComponent } from './components/registrar-ingreso/registrar-ingreso.component';
import { RegistrarEgresoComponent } from './components/registrar-egreso/registrar-egreso.component';
import { RegistrarRemisionComponent } from './components/registrar-remision/registrar-remision.component';
import { PanelContenedoresComponent } from './components/panel-contenedores/panel-contenedores.component';
import { ListaContenedoresComponent } from './components/lista-contenedores/lista-contenedores.component';
import { EditarContenedoresComponent } from './components/editar-contenedores/editar-contenedores.component';
import { PanelMovimientosComponent } from './components/panel-movimientos/panel-movimientos.component';
import { ListaMovimientosComponent } from './components/lista-movimientos/lista-movimientos.component';
import { PanelBookingComponent } from './components/panel-booking/panel-booking.component';
import { ListaBookingComponent } from './components/lista-booking/lista-booking.component';
import { Ng2CompleterModule } from "ng2-completer";
import { RefreshloginComponent } from './components/refreshlogin/refreshlogin.component';



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
    ConfirmDialogModule,
    DialogModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    Ng2CompleterModule,
    TooltipModule,
    DropdownModule,
    DataTableModule,
    SharedModule,
    FileUploadModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ToastyModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
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
    RegistrarIngresoComponent,
    RegistrarEgresoComponent,
    RegistrarRemisionComponent,
    PanelContenedoresComponent,
    ListaContenedoresComponent,
    EditarContenedoresComponent,
    PanelMovimientosComponent,
    ListaMovimientosComponent,
    PanelBookingComponent,
    ListaBookingComponent,
    RefreshloginComponent
  ],
  providers: [
  ConfirmationService,

  AuthenticationService,
  BookingService,
  UserService,
  MovimientosService,
  ContenedorService,
  AuthGuard,
  AdminGuard,
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
