import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { routing }        from './app-routing.module';

// PLUGINS
import {ToastyModule} from 'ng2-toasty';
import { ModalModule } from 'ngx-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';
import { MyDatePickerModule } from 'mydatepicker';
import { MyDateRangePickerModule } from 'mydaterangepicker';

// COMPONENTES
import { AppComponent } from './app.component';
import { AuthGuard } from './guards/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register-user/index';
import { HomeComponent } from './home/index';
import { PageContentComponent } from './page-content/index';
import { PageHeaderComponent } from './page-header/index';
import { PageSidebarComponent } from './page-sidebar/index';
import { PageFooterComponent } from './page-footer/index';

import { PrestacionComponent } from './prestaciones/index';

import { ObraSocialComponent } from './obras-sociales/index';

import { DoctorComponent } from './doctores/index';
import { VisitaComponent } from './doctores/visitas/index';

import { ParticularComponent } from './particulares/index';

import { PacienteComponent } from './pacientes/index';

import { IngresoGastoComponent } from './ingresos-gastos/index';

import { EstudioComponent } from './estudios/index';

// SERVICIOS
import { AuthenticationService, UserService, PrestacionService, ObraSocialService, DoctorService, ParticularService, PacienteService, VisitaService, IngresoGastoService, EstudioService } from './services/index';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    PageContentComponent,
    PageHeaderComponent,
    PageSidebarComponent,
    PageFooterComponent,
    PrestacionComponent,
    ObraSocialComponent,
    DoctorComponent,
    VisitaComponent,
    ParticularComponent,
    PacienteComponent,
    IngresoGastoComponent,
    EstudioComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ToastyModule.forRoot(),
    ModalModule.forRoot(),
    TextMaskModule,
    MyDatePickerModule,
    MyDateRangePickerModule,
    routing,
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    UserService,
    PrestacionService,
    ObraSocialService,
    DoctorService,
    ParticularService,
    PacienteService,
    VisitaService,
    IngresoGastoService,
    EstudioService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
