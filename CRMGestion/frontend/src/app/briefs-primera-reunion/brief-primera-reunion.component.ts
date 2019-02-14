import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AlertServer } from '../global/index';
import { BriefPrimeraReunionService } from '../services/index';
import { IMyOptions } from 'mydatepicker';
import { FormBuilder, Validators, NgForm, FormGroup } from '@angular/forms';
import { BriefPrimeraReunion } from '../models/index';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { Validaciones } from '../validaciones/index'
import { ApiSettings } from '../global/index';

@Component({
    moduleId: module.id,
    selector: 'brief-primera-reunion',
    templateUrl: './brief-primera-reunion.html',
    providers: [BriefPrimeraReunionService, AlertServer]
})

export class BriefPrimeraReunionComponent implements OnInit{
  estadoGuardado: boolean= true;
  formBrief: FormGroup;
  isSubmitBrief: boolean= false;
  selectedId: number;
  selectedName: string;
  dataBrief: any;
  loader: boolean;
  urlExport: string;

  constructor(
    private fb: FormBuilder,
    private servicio: BriefPrimeraReunionService,
    private toastyService:ToastyService,
    private toastyConfig: ToastyConfig,
    private route: ActivatedRoute,
    private router: Router,
    private alert_server: AlertServer,
  ){

    // OPCIONES PREDETERMINADAS TASTY
    this.toastyConfig.theme = 'bootstrap';
    this.toastyConfig.timeout = 5000;
    this.toastyConfig.showClose = true;

    // CAPTURAR ID Y NOMBRE DE LISTADO DE BRIEFS SELECCIONADO
    this.selectedId = +this.route.snapshot.params['id'];
    this.selectedName = this.route.snapshot.params['name'];
    this.servicio.getById(this.selectedId).subscribe(
      data => {
        this.dataBrief= this.getData(data);
        if (this.dataBrief) {
          // INSTANCIAR FORMULARIO
          this.createForm();
        }
      },
      error => {
        this.alert_server.messageError(error);
      }
    );
  }

  // CAPTURAR DATA DEL SERVIDOR
  getData(data: any[]){
    // URL PARA EXPORTA R A EXCEL LA ULTIMA CONSULTA
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.urlExport= ApiSettings.urlApi+'export-excel-briefs-primera-reunion?token='+currentUser.token+'&array='+JSON.stringify(data);

    for (let brief of data) {
        this.dataBrief= brief;
        return brief;
    }
  }

  // CARGA AUTOMATICA
  ngOnInit(){

  }

  // INICIAR FORMULARIO
  createForm(){
    this.formBrief= this.fb.group({
        // INICIAL
        contrato_firmado: this.dataBrief.contrato_firmado,
        presentarse: this.dataBrief.presentarse,
        explicacion_agenda: this.dataBrief.explicacion_agenda,
        explicacion_interlocutor: this.dataBrief.explicacion_interlocutor,

        // ADWORDS
        estrategia_general: [this.dataBrief.estrategia_general, Validators.compose([
            Validators.required
        ])],
        segmentacion_geografica: [this.dataBrief.segmentacion_geografica, Validators.compose([
            Validators.required
        ])],
        presupuesto_adwords: [this.dataBrief.presupuesto_adwords, Validators.compose([
            Validators.required
        ])],
        acceso_campana: this.dataBrief.acceso_campana,
        explicacion_formas_pago: this.dataBrief.explicacion_formas_pago,
        datos_facturacion: this.dataBrief.datos_facturacion,
        como_buscaria_cliente: this.dataBrief.como_buscaria_cliente,
        aclaratoria: this.dataBrief.aclaratoria,
        explicacion_mejora: this.dataBrief.explicacion_mejora,

        // REMARKETING
        explicacion_remarketing: this.dataBrief.explicacion_remarketing,
        comentarios_remarketing: this.dataBrief.comentarios_remarketing,

        // FACEBBOKS POSTEOS
        estrategia_facebook_posteos: [this.dataBrief.estrategia_facebook_posteos, Validators.compose([
            Validators.required
        ])],
        datos_fan_page_posteos: this.dataBrief.datos_fan_page_posteos,

        // CHAT
        explicacion_chat: this.dataBrief.explicacion_chat,

        // ADMINISTRATIVO
        depende_administracion: this.dataBrief.depende_administracion,
        recordar_pago: this.dataBrief.recordar_pago,

        // FINAL
        explicacion_gestion_ventas: this.dataBrief.explicacion_gestion_ventas,
        reuniones: this.dataBrief.reuniones,
        forma_trabajo: this.dataBrief.forma_trabajo,
        plan_accion: this.dataBrief.plan_accion,
        expectativas_plan_accion: this.dataBrief.expectativas_plan_accion,
        reportes: this.dataBrief.reportes,
        recordar_pago_adelantado: this.dataBrief.recordar_pago_adelantado,
        formas_aprobacion: this.dataBrief.formas_aprobacion,
        explicacion_cantidad_landings_campanas: this.dataBrief.explicacion_cantidad_landings_campanas,
        explicacion_responder_consultas: this.dataBrief.explicacion_responder_consultas,
        puntos_conflictos: [this.dataBrief.puntos_conflictos, Validators.compose([
            Validators.required
        ])],

        // MODELO DE NEGOCIOS
        modelo_negocio: [this.dataBrief.modelo_negocio, Validators.compose([
            Validators.required
        ])],
        expectativas_performance: this.dataBrief.expectativas_performance,
        relevo_ventas: this.dataBrief.relevo_ventas,

        // LANDING PAGES
        recordar_objetivo: this.dataBrief.recordar_objetivo,
        diferencia_landing: this.dataBrief.diferencia_landing,
        mostrar_ejemplos_landings: this.dataBrief.mostrar_ejemplos_landings,
        pedir_datos_landing: this.dataBrief.pedir_datos_landing,
        estrategia_landing: [this.dataBrief.estrategia_landing, Validators.compose([
            Validators.required
        ])],
        secciones_landing: this.dataBrief.secciones_landing,
        pq_hosteamos: this.dataBrief.pq_hosteamos,
        donde_hostear: this.dataBrief.donde_hostear,

        // FACEBOOK ADS
        estrategia_facebook_ads: [ this.dataBrief.estrategia_facebook_ads, Validators.compose([
            Validators.required
        ])],
        datos_fan_page_ads:  this.dataBrief.datos_fan_page_ads,
        datos_tdc:  this.dataBrief.datos_tdc,
        presupuesto_facebook_ads: this.dataBrief.presupuesto_facebook_ads,

        // MAILING
        estrategia_mailing: [this.dataBrief.estrategia_mailing, Validators.compose([
            Validators.required
        ])],
        info_primeros_mailings: this.dataBrief.info_primeros_mailings,
        pedir_bd: this.dataBrief.pedir_bd,
        explicacion_mailing_no_ventas: this.dataBrief.explicacion_mailing_no_ventas,

        // DATOS DE ACCESO
        datos_sitio: this.dataBrief.datos_sitio,
    })
  }

  // CAPTURAR CADA VEZ QUE HAY UN CAMBIO EN LOS CAMPOS DE TEXTO PARA GUARDARS
  guardarCambio(campo: string, valorCampo: any){
    var validForm= this.formBrief.get(campo).valid;
    if (validForm) {

      this.estadoGuardado= false;
      let model: any= {
        id: this.dataBrief.id,
        campo: campo,
        valorCampo: valorCampo,
        id_cliente: this.selectedId,
        saveOne: true
      }
      this.servicio.update(model)
      .subscribe(
        data => {
          this.estadoGuardado= true;
        },
        error => {
          this.estadoGuardado= false;
          this.alert_server.messageError(error);
        }
      );

    }
  }

  // SET CONTROL DE FORMULARIO
  setControl(campo: any, event: boolean){
    if (event == true) {
        var valorCampo= true;
    }else{
        var valorCampo= false;
    }
    if (campo=='contrato_firmado') {
      this.formBrief.patchValue({contrato_firmado: valorCampo});
      this.guardarCambio(campo, valorCampo);
    }
    if (campo=='presentarse') {
      this.formBrief.patchValue({presentarse: valorCampo});
      this.guardarCambio(campo, valorCampo);
    }
    if (campo=='explicacion_agenda') {
      this.formBrief.patchValue({explicacion_agenda: valorCampo});
      this.guardarCambio(campo, valorCampo);
    }
    if (campo=='explicacion_interlocutor') {
      this.formBrief.patchValue({explicacion_interlocutor: valorCampo});
      this.guardarCambio(campo, valorCampo);
    }
    if (campo=='explicacion_formas_pago') {
      this.formBrief.patchValue({explicacion_formas_pago: valorCampo});
      this.guardarCambio(campo, valorCampo);
    }
    if (campo=='aclaratoria') {
      this.formBrief.patchValue({aclaratoria: valorCampo});
      this.guardarCambio(campo, valorCampo);
    }
    if (campo=='explicacion_mejora') {
      this.formBrief.patchValue({explicacion_mejora: valorCampo});
      this.guardarCambio(campo, valorCampo);
    }
    if (campo=='recordar_objetivo') {
      this.formBrief.patchValue({recordar_objetivo: valorCampo});
      this.guardarCambio(campo, valorCampo);
    }
    if (campo=='diferencia_landing') {
      this.formBrief.patchValue({diferencia_landing: valorCampo});
      this.guardarCambio(campo, valorCampo);
    }
    if (campo=='mostrar_ejemplos_landings') {
      this.formBrief.patchValue({mostrar_ejemplos_landings: valorCampo});
      this.guardarCambio(campo, valorCampo);
    }
    if (campo=='pq_hosteamos') {
      this.formBrief.patchValue({pq_hosteamos: valorCampo});
      this.guardarCambio(campo, valorCampo);
    }
    if (campo=='explicacion_remarketing') {
      this.formBrief.patchValue({explicacion_remarketing: valorCampo});
      this.guardarCambio(campo, valorCampo);
    }
    if (campo=='pedir_bd') {
      this.formBrief.patchValue({pedir_bd: valorCampo});
      this.guardarCambio(campo, valorCampo);
    }
    if (campo=='explicacion_mailing_no_ventas') {
      this.formBrief.patchValue({explicacion_mailing_no_ventas: valorCampo});
      this.guardarCambio(campo, valorCampo);
    }
    if (campo=='explicacion_chat') {
      this.formBrief.patchValue({explicacion_chat: valorCampo});
      this.guardarCambio(campo, valorCampo);
    }
    if (campo=='depende_administracion') {
      this.formBrief.patchValue({depende_administracion: valorCampo});
      this.guardarCambio(campo, valorCampo);
    }
    if (campo=='recordar_pago') {
      this.formBrief.patchValue({recordar_pago: valorCampo});
      this.guardarCambio(campo, valorCampo);
    }
    if (campo=='explicacion_gestion_ventas') {
      this.formBrief.patchValue({explicacion_gestion_ventas: valorCampo});
      this.guardarCambio(campo, valorCampo);
    }
    if (campo=='reuniones') {
      this.formBrief.patchValue({reuniones: valorCampo});
      this.guardarCambio(campo, valorCampo);
    }
    if (campo=='forma_trabajo') {
      this.formBrief.patchValue({forma_trabajo: valorCampo});
      this.guardarCambio(campo, valorCampo);
    }
    if (campo=='plan_accion') {
      this.formBrief.patchValue({plan_accion: valorCampo});
      this.guardarCambio(campo, valorCampo);
    }
    if (campo=='expectativas_plan_accion') {
      this.formBrief.patchValue({expectativas_plan_accion: valorCampo});
      this.guardarCambio(campo, valorCampo);
    }
    if (campo=='reportes') {
      this.formBrief.patchValue({reportes: valorCampo});
      this.guardarCambio(campo, valorCampo);
    }
    if (campo=='recordar_pago_adelantado') {
      this.formBrief.patchValue({recordar_pago_adelantado: valorCampo});
      this.guardarCambio(campo, valorCampo);
    }
    if (campo=='formas_aprobacion') {
      this.formBrief.patchValue({formas_aprobacion: valorCampo});
      this.guardarCambio(campo, valorCampo);
    }
    if (campo=='explicacion_cantidad_landings_campanas') {
      this.formBrief.patchValue({explicacion_cantidad_landings_campanas: valorCampo});
      this.guardarCambio(campo, valorCampo);
    }
    if (campo=='explicacion_responder_consultas') {
      this.formBrief.patchValue({explicacion_responder_consultas: valorCampo});
      this.guardarCambio(campo, valorCampo);
    }
  }

  // GUARDADO COMPLETO
  guardarBrief(form: any){
    this.loader= true;
    this.estadoGuardado= false;
    form.value.id= this.dataBrief.id;
    form.value.id_cliente= this.selectedId;
    this.servicio.update(form.value)
    .subscribe(
      data => {
        this.estadoGuardado= true;
        this.loader= false;
        this.router.navigate(['/clientes']);
        this.toastyService.info("El brief de primera reunión fue guardado en borrador");
      },
      error => {
        this.estadoGuardado= false;
        this.loader= false;
        this.alert_server.messageError(error);
      }
    );
  }

  // GENERAR BRIEF IMPACTA EN CLIENTES
  generarBrief(form: any){
    if (this.formBrief.valid) {

      this.loader= true;
      this.estadoGuardado= false;
      form.value.estado= "Generado";
      form.value.id_cliente= this.selectedId;
      this.servicio.update(form.value)
      .subscribe(
        data => {
          this.estadoGuardado= true;
          this.loader= false;
          this.getData(data);
          this.router.navigate(['/clientes']);
          this.toastyService.success("El brief de primera reunión fue generado exitosamente");
        },
        error => {
          this.estadoGuardado= false;
          this.loader= false;
          this.alert_server.messageError(error);
        }
      );

    }

  }

}
