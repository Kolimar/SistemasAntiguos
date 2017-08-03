import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SharedModule } from './global/index'

import { AppComponent }  from './app.component';
import { routing }        from './app-routing.module';

// PLUGINES
import { MyDatePickerModule } from 'mydatepicker';
import { ToastyModule } from 'ng2-toasty';
import { ModalModule } from 'ng2-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';
import { FileUploadModule } from 'primeng/primeng';

import { AlertComponent } from './directives/index';
import { AuthGuard } from './guards/index';
import { AlertService, AuthenticationService, UserService, TareaTemplateService, ServicioService, ServicioTareaTemplateService, TareaService, BriefService, ClienteService, RolContactoService, FormaPagoService, CanalAdquisicionService, MotivoLogService, TipoTareaService } from './services/index';

import { HomeComponent } from './home/index';
import { PageContentComponent } from './page-content/index';
import { PageHeaderComponent } from './page-header/index';
import { PageSidebarComponent } from './page-sidebar/index';
import { PageFooterComponent } from './page-footer/index';

import { TareaTemplateComponent } from './tareas-templates/index';

import { ServicioComponent } from './servicios/index';
import { ServicioTareaTemplateComponent } from './servicios/index';

import { TareaComponent } from './tareas/index';

import { BriefComponent } from './briefs/index';
import { CreateBriefComponent } from './briefs/index';
import { EditBriefComponent } from './briefs/index';

import { ClienteComponent } from './clientes/index';
import { CreateClienteComponent } from './clientes/index';
import { EditClienteComponent } from './clientes/index';

import { RolContactoComponent } from './roles-contactos/index';

import { FormaPagoComponent } from './formas-pago/index';

import { CanalAdquisicionComponent } from './canales-adquisicion/index';

import { MotivoLogComponent } from './motivos-logs/index';

import { TipoTareaComponent } from './tipos-tareas/index';

import { UserComponent } from './users/index';

import { LogComponent } from './logs/index';

import { PanelClienteComponent } from './panel-clientes/index';

import { BriefPrimeraReunionComponent } from './briefs-primera-reunion/index';

import { LoginComponent } from './login/index';
import { RegisterComponent } from './register-user/index';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        SharedModule,
        ToastyModule.forRoot(),
        ModalModule.forRoot(),
        MyDatePickerModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        routing,
        TextMaskModule,
        FileUploadModule,
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        PageContentComponent,
        PageHeaderComponent,
        PageSidebarComponent,
        PageFooterComponent,
        LoginComponent,
        RegisterComponent,
        TareaTemplateComponent,
        ServicioComponent,
        ServicioTareaTemplateComponent,
        TareaComponent,
        BriefComponent,
        CreateBriefComponent,
        EditBriefComponent,
        ClienteComponent,
        CreateClienteComponent,
        EditClienteComponent,
        RolContactoComponent,
        FormaPagoComponent,
        CanalAdquisicionComponent,
        MotivoLogComponent,
        TipoTareaComponent,
        UserComponent,
        LogComponent,
        PanelClienteComponent,
        BriefPrimeraReunionComponent
    ],
    providers: [
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService,
        TareaTemplateService,
        ServicioService,
        ServicioTareaTemplateService,
        TareaService,
        BriefService,
        ClienteService,
        RolContactoService,
        FormaPagoService,
        CanalAdquisicionService,
        MotivoLogService,
        TipoTareaService,
        {
          provide: LocationStrategy,
          useClass: HashLocationStrategy
        }
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
