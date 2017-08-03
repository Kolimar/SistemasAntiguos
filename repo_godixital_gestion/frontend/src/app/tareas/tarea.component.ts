import { Component, AfterViewInit, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import { FormBuilder, Validators, NgForm, FormGroup } from '@angular/forms';
import { TareaService } from '../services/index';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { Validaciones } from '../validaciones/index';
import { ModalDirective } from 'ng2-bootstrap';
import { IMyOptions } from 'mydatepicker';
import { Observable } from 'rxjs/Observable';
import { Subject } from "rxjs";
import { AlertServer } from '../global/index';
import { Tarea, TareaTemplate, Cliente, Servicio, User, Subtarea, TipoTarea } from '../models/index';

@Component({
    moduleId: module.id,
    selector: 'tarea',
    templateUrl: './tarea.html',
    providers: [TareaService, AlertServer]
})

export class TareaComponent implements OnInit, AfterViewInit{
    @ViewChild('modalCrear') public modalCrear:ModalDirective;
    @ViewChild('modalEditar') public modalEditar:ModalDirective;
    @ViewChild('modalSubtareas') public modalSubtareas:ModalDirective;
    @ViewChild('modalFechaPrimeraReunion') public modalFechaPrimeraReunion:ModalDirective;
    formCreacion: FormGroup;
    formEdicion: FormGroup;
    formSubtareas: FormGroup;
    formIngresoFechaPrimeraReunion: FormGroup;
    fechaLimiteCreate: any;
    listTareas: Tarea[] = [];
    cmbTiposTareas: TipoTarea[] = [];
    listSubTareas: Subtarea[] = [];
    editTarea: Tarea;
    cmbTareasTemplates: TareaTemplate[] = [];
    cmbClientes: Cliente[] = [];
    cmbClientesActivos: Cliente[] = [];
    cmbClientesServicios: any;
    cmbPmCliente: Cliente[] = [];
    cmbUsers: User[] = [];
    cmbTareas: Tarea[] = [];
    cantidadSubtareas: Tarea[]= [];
    deleteSubtareas: Subtarea;
    deleteTareas: Tarea;
    date = new Date().toJSON().slice(0,10);
    status: number;
    selectPmcliente: any;
    selectPmclienteN: any;
    vista: number;
    idSubtarea: number;
    modificar: boolean= false;
    listFiltro: any = '';
    verValidacion: boolean = false;
    config: any;
    selectTT: any = '';
    pagina: number= -1;
    posicionList: number;
    selectTituloTareaTemplate: string;
    selectDescripcionTareaTemplate: string;
    isSubmitTarea: boolean = false;
    isSubmitSubtarea: boolean = false;
    verificarDescripcion: string;
    workflowName: string;
    loader: boolean= false;
    isSubmitFechaComienzo: boolean= false;
    modelTareaEdicion: any;
    nombreServicioWorkflow: string;
    currentUser: any;
    tipoTareaSelect: number;

    // FILTROS
    es_critica_filtro: string = '';
    ultimo_milestone_filtro: string = '';
    urgente_filtro: string = '';
    falta_info_filtro: string = '';
    prioridad_filtro: string = '';
    estado_filtro: string= 'Pendiente';
    titulo_filtro: string = '';
    descripcion_filtro: string = '';
    fecha_limite_filtro: string = '';
    fecha_ejecucion_filtro: string = '';
    cliente_filtro: string = '';
    nombre_servicio_filtro: string = '';
    asignado_filtro: string = '';
    titulo_ord: string= '';
    fecha_limite_ord: string= '';
    fecha_ejecucion_ord: string= '';
    prioridad_ord: string= '';
    tipo_tarea_filtro: string = '';

	constructor(
	    private router: Router,
      private servicio: TareaService,
      private fb: FormBuilder,
      private toastyService:ToastyService,
      private toastyConfig: ToastyConfig,
      private alert_server: AlertServer,
    ){
		  // OPCIONES PREDETERMINADAS TASTY
      this.toastyConfig.theme = 'bootstrap';
      this.toastyConfig.timeout = 5000;
      this.toastyConfig.showClose = true;

      this.loadCurrentUser();

      // REGLAS DE VALIDACION
      this.createForm();
      this.createFormSubtarea();

	}

    // CARGA AUTOMATICA
    ngOnInit(){
        this.asignado_filtro= this.currentUser;
        this.loadFilter();
    }

    // USUARIO LOGUEADO
    loadCurrentUser(){
      var user= JSON.parse(localStorage.getItem('currentUser'));
      this.currentUser= user.user.id;
    }

    ngAfterViewInit(){
      this.loadTareasTemplates();
      this.loadClientes();
      this.loadClientesActivos();
      this.loadPM();
      this.loadTareas();
      this.loadTiposTareas();
    }

    // INSTANCIAR FORMULARIOS
    createForm(){
        this.formCreacion= this.fb.group({
            id_tarea_template: '',
            titulo: ['', Validators.compose([
                Validators.required,
                Validators.maxLength(50),
                Validaciones.verificarEspacios,
            ])],
            descripcion: ['', Validators.compose([
                Validaciones.verificarEspacios,
            ])],
            fecha_limite: ['', Validators.compose([
                Validators.required,
            ])],
            fecha_ejecucion: '',
            urgente: [0, Validators.compose([
                Validators.required,
            ])],
            falta_info: [0, Validators.compose([
                Validators.required,
            ])],
            prioridad: ['', Validators.compose([
                Validators.required,
            ])],
            id_cliente: '',
            id_servicio: '',
            id_asignado: [this.currentUser, Validators.compose([
                Validators.required,
            ])],
            id_tipo_tarea: [1, Validators.compose([
                Validators.required,
            ])],
        })
    }

    createFormSubtarea(){
      this.formSubtareas= this.fb.group({
          titulo: ['', Validators.compose([
              Validators.required,
              Validators.maxLength(50),
              Validaciones.verificarEspacios,
          ])],
          descripcion: '',
          completa: '',
      })
    }

    // CARGAR BUSQUEDA EN FILTRO
    loadSearch(){
        this.search(
          this.listFiltro.es_critica,
          this.listFiltro.ultimo_milestone,
          this.listFiltro.titulo,
          this.listFiltro.descripcion,
          this.listFiltro.fecha_limite,
          this.listFiltro.fecha_ejecucion,
          this.listFiltro.urgente,
          this.listFiltro.falta_info,
          this.listFiltro.prioridad,
          this.listFiltro.tipo_tarea,
          this.listFiltro.cliente,
          this.listFiltro.nombre_servicio,
          this.listFiltro.asignado,
          this.listFiltro.estado,
          this.listFiltro.titulo_ord,
          this.listFiltro.fecha_ejecucion_ord,
          this.listFiltro.fecha_limite_ord,
          this.listFiltro.prioridad_ord,
        );
    }

    // CARGAR FILTRO
    loadFilter(){
        this.filter(
          this.listFiltro.es_critica,
          this.listFiltro.ultimo_milestone,
          this.listFiltro.titulo,
          this.listFiltro.descripcion,
          this.listFiltro.fecha_limite,
          this.listFiltro.fecha_ejecucion,
          this.listFiltro.urgente,
          this.listFiltro.falta_info,
          this.listFiltro.prioridad,
          this.listFiltro.tipo_tarea,
          this.listFiltro.cliente,
          this.listFiltro.nombre_servicio,
          this.listFiltro.asignado,
          this.listFiltro.estado,
          this.listFiltro.titulo_ord,
          this.listFiltro.fecha_ejecucion_ord,
          this.listFiltro.fecha_limite_ord,
          this.listFiltro.prioridad_ord
        );
    }

    // RESETEAR FILTRO A VACIO
    resetFilter(){
      this.es_critica_filtro= '';
      this.ultimo_milestone_filtro= '';
      this.urgente_filtro= '';
      this.falta_info_filtro= '';
      this.prioridad_filtro= '';
      this.tipo_tarea_filtro= '';
      this.estado_filtro= '';
      this.titulo_filtro= '';
      this.descripcion_filtro= '';
      this.fecha_limite_filtro= '';
      this.fecha_ejecucion_filtro= '';
      this.cliente_filtro= '';
      this.nombre_servicio_filtro= '';
      this.asignado_filtro= '';
      this.titulo_ord= '';
      this.fecha_limite_ord= '';
      this.fecha_ejecucion_ord= '';
      this.prioridad_ord= '';
    }

    // APLICAR FILTRADO
    filter(es_critica: string, ultimo_milestone: string, titulo: string, descripcion: string, fecha_limite: string, fecha_ejecucion: string, urgente: string, falta_info: string, prioridad: string, tipo_tarea: string, cliente: string, nombre_servicio: string, asignado: string, estado: string, titulo_ord: string, fecha_ejecucion_ord: string, fecha_limite_ord: string, prioridad_ord: string){
        this.pagina = -1;
        this.listTareas = [];
        this.search(es_critica, ultimo_milestone, titulo, descripcion, fecha_limite, fecha_ejecucion, urgente, falta_info, prioridad, tipo_tarea, cliente, nombre_servicio, asignado, estado, titulo_ord, fecha_ejecucion_ord, fecha_limite_ord, prioridad_ord);
    }

    // FILTROS DE BUSQUEDA y ORDENAMIENTO
    search(es_critica: string, ultimo_milestone: string, titulo: string, descripcion: string, fecha_limite: string, fecha_ejecucion: string, urgente: string, falta_info: string, prioridad: string, tipo_tarea: string, cliente: string, nombre_servicio: string, asignado: string, estado: string, titulo_ord: string, fecha_ejecucion_ord: string, fecha_limite_ord: string, prioridad_ord: string){
        this.pagina++;
        var model: any = {
            es_critica: es_critica,
            ultimo_milestone: ultimo_milestone,
            titulo: titulo,
            descripcion: descripcion,
            fecha_limite: fecha_limite,
            fecha_ejecucion: fecha_ejecucion,
            urgente: urgente,
            falta_info: falta_info,
            prioridad: prioridad,
            tipo_tarea: tipo_tarea,
            cliente: cliente,
            nombre_servicio: nombre_servicio,
            asignado: asignado,
            estado: estado,
            titulo_ord: titulo_ord,
            fecha_ejecucion_ord: fecha_ejecucion_ord,
            fecha_limite_ord: fecha_limite_ord,
            pagina: this.pagina,
        }
        this.listFiltro= model;
        this.servicio.search(model).subscribe(
          (lista)=>this.cargarListaTareas(lista),
          error => {
            this.alert_server.messageError(error);
          }
        );
    }
    cargarListaTareas(data: Tarea[]){
        this.transformarHTML(data);
        this.listTareas = this.listTareas.concat(data);
    }

    // CONVERTIR A TEXTO PLATO HTML
    transformarHTML(data: Tarea[]){
        let txt = document.createElement("textarea");
        for (let i = 0; i < data.length; i++) {
            if (data[i].descripcion) {
              var sinTags= data[i].descripcion.replace(/<\/?[^>]+(>|$)/g, "");
            }else{
              var sinTags= data[i].descripcion;
            }
            txt.innerHTML = sinTags;
            if (txt.value.length < 60) {
              let valorDescripcion= txt.value.substring(0, 60);
              data[i].descripcionConvertidaHTML= valorDescripcion;
            }else{
              let valorDescripcion= txt.value.substring(0, 60)+"...";
              data[i].descripcionConvertidaHTML= valorDescripcion;
            }
        }
    }

    // CARGAR DEL COMBO TAREAS TEMPLATES
    loadTareasTemplates(){
        this.servicio.getTareasTemplates().subscribe(
          cmbTareasTemplates => { this.cmbTareasTemplates = cmbTareasTemplates; },
          error => {
            this.alert_server.messageError(error);
          }
        );
    }

    // SELECCIONAR EL TITULO DE LA TAREA TEMPLATE ELEGINA PARA MOSTRAR EN INPUT TIULO Y DESRIPCION
    onSelectTareaTemplate(id_tarea_template: number){
        if(id_tarea_template == null || !id_tarea_template) {
          this.formCreacion.setValue({
            id_tarea_template: '',
            titulo: '',
            descripcion: '',
            fecha_limite: '',
            fecha_ejecucion: this.formCreacion.get('fecha_ejecucion').value,
            urgente: this.formCreacion.get('urgente').value,
            falta_info: this.formCreacion.get('falta_info').value,
            prioridad: this.formCreacion.get('prioridad').value,
            id_cliente: this.formCreacion.get('id_cliente').value,
            id_servicio: this.formCreacion.get('id_servicio').value,
            id_asignado: '',
            id_tipo_tarea: 1,
          })
        }else{
            this.servicio.getTareasTemplatesDetalle(id_tarea_template).subscribe(
                cmbTareasTemplatesDetalle => {
                    cmbTareasTemplatesDetalle = cmbTareasTemplatesDetalle;
                    this.extractDataTT(cmbTareasTemplatesDetalle);
                },
                error => {
                  this.alert_server.messageError(error);
                }
            );
        }
    }
    extractDataTT(data: TareaTemplate[]){
        for (let select of data) {
            this.selectTT= select;
            this.selectTituloTareaTemplate= this.selectTT.titulo_tt;
            this.selectDescripcionTareaTemplate= this.selectTT.descripcion_tt;
            var model_fecha= new Date(this.selectTT.fecha_limite_tt_f);
            this.fechaLimiteCreate = { date: { year: model_fecha.getUTCFullYear(), month: model_fecha.getUTCMonth() + 1, day: model_fecha.getUTCDate()} };
            this.tipoTareaSelect= this.selectTT.id_tipo_tarea;
        }
        this.formCreacion.setValue({
          id_tarea_template: this.selectTT.id,
          titulo: this.selectTituloTareaTemplate,
          descripcion: this.selectDescripcionTareaTemplate,
          fecha_limite: this.fechaLimiteCreate,
          fecha_ejecucion: this.formCreacion.get('fecha_ejecucion').value,
          urgente: this.formCreacion.get('urgente').value,
          falta_info: this.formCreacion.get('falta_info').value,
          prioridad: this.formCreacion.get('prioridad').value,
          id_cliente: '',
          id_servicio: '',
          id_asignado: '',
          id_tipo_tarea: this.tipoTareaSelect,
        })
    }

    // CARGA DEL COMBO CLIENTES
    loadClientes(){
        this.servicio.getClientes().subscribe(
          cmbClientes => { this.cmbClientes = cmbClientes; },
          error => {
            this.alert_server.messageError(error);
          }
        );
    }

    // CARGA DEL COMBO CLIENTES ACTIVOS
    loadClientesActivos(){
        this.servicio.getClientesActivos().subscribe(
          cmbClientesActivos => { this.cmbClientesActivos = cmbClientesActivos; },
          error => {
            this.alert_server.messageError(error);
          }
        );
    }

    // CARGA DEL COMBO CLIENTES
    loadPM(){
        this.servicio.getUsers().subscribe(
          cmbUsers => { this.cmbUsers = cmbUsers; },
          error => {
            this.alert_server.messageError(error);
          }
        );
    }

    // CARGA DEL COMBO TAREAS
    loadTareas(){
        this.servicio.getAll().subscribe(
          cmbTareas => { this.cmbTareas = cmbTareas; },
          error => {
            this.alert_server.messageError(error);
          }
        );
    }

    // CARGA DEL COMBO TAREAS
    loadTiposTareas(){
        this.servicio.getTiposTareas().subscribe(
          cmbTiposTareas => { this.cmbTiposTareas = cmbTiposTareas; },
          error => {
            this.alert_server.messageError(error);
          }
        );
    }

    // CARGA DEL COMBO SERVICIOS ASOCIADOS A CLIENTES
    onSelectCliente(id: number){
        if(id == null || !id) {
          this.formCreacion.setValue({
            id_tarea_template: this.formCreacion.get('id_tarea_template').value,
            titulo: this.formCreacion.get('titulo').value,
            descripcion: this.formCreacion.get('descripcion').value,
            fecha_limite: this.formCreacion.get('fecha_limite').value,
            fecha_ejecucion: this.formCreacion.get('fecha_ejecucion').value,
            urgente: this.formCreacion.get('urgente').value,
            falta_info: this.formCreacion.get('falta_info').value,
            prioridad: this.formCreacion.get('prioridad').value,
            id_cliente: this.formCreacion.get('id_cliente').value,
            id_servicio: '',
            id_asignado: '',
            id_tipo_tarea: this.formCreacion.get('id_tipo_tarea').value,
          })
          this.cmbClientesServicios= null;
        }else{
            this.servicio.getClientesServicios(id).subscribe(
              cmbClientesServicios => { this.cmbClientesServicios = cmbClientesServicios; },
              error => {
                this.alert_server.messageError(error);
              }
            );
            this.servicio.getPmCliente(id).subscribe(
                selectPmclienteS => {
                    selectPmclienteS = selectPmclienteS;
                    this.extractDataSC(selectPmclienteS);
                },
                error => {
                  this.alert_server.messageError(error);
                }
            );
        }
    }
    extractDataSC(object: any){
        if(this.selectTT.asigna_pm_automatico == 1) {
            for (let select of object) {
                this.selectPmcliente= select;
                this.formCreacion.setValue({
                  id_tarea_template: this.formCreacion.get('id_tarea_template').value,
                  titulo: this.formCreacion.get('titulo').value,
                  descripcion: this.formCreacion.get('descripcion').value,
                  fecha_limite: this.formCreacion.get('fecha_limite').value,
                  fecha_ejecucion: this.formCreacion.get('fecha_ejecucion').value,
                  urgente: this.formCreacion.get('urgente').value,
                  falta_info: this.formCreacion.get('falta_info').value,
                  prioridad: this.formCreacion.get('prioridad').value,
                  id_cliente: this.formCreacion.get('id_cliente').value,
                  id_servicio: '',
                  id_asignado: this.selectPmcliente.pm_asignado,
                  id_tipo_tarea: this.formCreacion.get('id_tipo_tarea').value,
                })
            }
        }
    }

    // CARGA DEL COMBO SERVICIOS ASOCIADOS A CLIENTES
    onSelectClienteEdit(id: number){
        if(id == null || !id) {
          this.formEdicion.setValue({
            id_tarea_template2: this.formEdicion.get('id_tarea_template2').value,
            titulo2: this.formEdicion.get('titulo2').value,
            descripcion2: this.formEdicion.get('descripcion2').value,
            fecha_limite2: this.formEdicion.get('fecha_limite2').value,
            fecha_ejecucion2: this.formEdicion.get('fecha_ejecucion2').value,
            urgente2: this.formEdicion.get('urgente2').value,
            falta_info2: this.formEdicion.get('falta_info2').value,
            prioridad2: this.formCreacion.get('prioridad2').value,
            id_cliente2: this.formEdicion.get('id_cliente2').value,
            id_servicio2: '',
            id_asignado2: '',
            id_tipo_tarea: this.formEdicion.get('id_tipo_tarea2').value,
          })
          this.cmbClientesServicios= null;
        }else{
            this.servicio.getClientesServicios(id).subscribe(
              cmbClientesServicios => { this.cmbClientesServicios = cmbClientesServicios; },
              error => {
                this.alert_server.messageError(error);
              }
            );
            this.servicio.getPmCliente(id).subscribe(
                selectPmclienteS => {
                    selectPmclienteS = selectPmclienteS;
                    this.extractDataSCEdit(selectPmclienteS);
                },
                error => {
                  this.alert_server.messageError(error);
                }
            );
        }
    }
    extractDataSCEdit(object: any){
        if(this.selectTT.asigna_pm_automatico == 1) {
            for (let select of object) {
                this.selectPmcliente= select;
                this.formEdicion.setValue({
                  id_tarea_template: this.formEdicion.get('id_tarea_template2').value,
                  titulo: this.formEdicion.get('titulo2').value,
                  descripcion: this.formEdicion.get('descripcion2').value,
                  fecha_limite: this.formEdicion.get('fecha_limite2').value,
                  fecha_ejecucion: this.formEdicion.get('fecha_ejecucion2').value,
                  urgente: this.formEdicion.get('urgente2').value,
                  falta_info: this.formEdicion.get('falta_info2').value,
                  prioridad2: this.formCreacion.get('prioridad2').value,
                  id_cliente: this.formEdicion.get('id_cliente2').value,
                  id_servicio: '',
                  id_asignado: '',
                  id_tipo_tarea: this.formEdicion.get('id_tipo_tarea2').value,
                })
            }
        }
    }

    // CARGA LISTADO DE SUB TAREAS
    loadSubtareas(){
        this.servicio.getSubtareas(this.idSubtarea).subscribe(
          listSubTareas => { this.listSubTareas = listSubTareas; },
          error => {
            this.alert_server.messageError(error);
          }
        );
    }

    // VERIFICAR SUBTAREAS COMPLETADAS DE TOTALES
    loadCantidadSubtareas(id: number){
        this.servicio.getCantidadSubtareas(id).subscribe(
          cantidadSubtareas => { this.cantidadSubtareas = cantidadSubtareas; },
          error => {
            this.alert_server.messageError(error);
          }
        );
    }

    // OPCIONES DE PLUGING DATEPICKER
    myDatePickerOptions: IMyOptions = {
        dateFormat: 'dd-mm-yyyy',
        editableDateField: false,
        disableWeekends: true,
        selectionTxtFontSize: '1.3rem',
        dayLabels: { su: "Do", mo: "Lu", tu: "Ma", we: "Mi", th: "Ju", fr: "Vi", sa: "Sa" },
        monthLabels: { 1: "Ene", 2: "Feb", 3: "Mar", 4: "Abr", 5: "May", 6: "Jun", 7: "Jul", 8: "Ago", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dic" },
        todayBtnTxt: "Hoy",
        firstDayOfWeek: "mo",
        showInputField: true,
        openSelectorOnInputClick: true
    }

    setDate(): void {
        // Set today date using the setValue function
        let date = new Date();
        this.formCreacion.setValue({fecha_limite: {
        date: {
            year: date.getUTCFullYear(),
            month: date.getUTCMonth() + 1,
            day: date.getUTCDate()}
        }});
        this.formCreacion.setValue({fecha_ejecucion: {
        date: {
            year: date.getUTCFullYear(),
            month: date.getUTCMonth() + 1,
            day: date.getUTCDate()}
        }});
    }

    clearDate(): void {
        // Clear the date using the setValue function
        this.formCreacion.setValue({fecha_limite: ''});
        this.formCreacion.setValue({fecha_ejecucion: ''});
    }

    // ABRIR MODAL DE CREACION
    showModalCrear():void {
        this.modalCrear.show();
    }

    // CERRAR MODAL DE CREACION
    hideModalCrear():void {
        this.modalCrear.hide();
        this.isSubmitTarea= false;
        this.resetCreateForm();
    }

    //RESETEAR FORMULARIO CREACION
    resetCreateForm(){
      this.formCreacion.reset({
          id_tarea_template: '',
          titulo: '',
          descripcion: '',
          fecha_limite: '',
          fecha_ejecucion: '',
          urgente: 0,
          falta_info: 0,
          prioridad: '',
          id_cliente: '',
          id_servicio: '',
          id_asignado: this.currentUser,
          id_tipo_tarea: 1,
      })
    }

    // GUARDAR BORRADOR
    borrador(){

        this.status= 0;
        this.isSubmitTarea= true;
        if(this.formCreacion.get('titulo').valid && this.isSubmitTarea) {

            if(this.formCreacion.get('descripcion').value) {

                var descripcion= this.formCreacion.get('descripcion').value.trim();

            }else{

                var descripcion= this.formCreacion.get('descripcion').value;
            }

            if(this.selectTT) {

                if(this.formCreacion.get('fecha_limite').value) {
                    var fecha_limite: any = [this.formCreacion.get('fecha_limite').value.date.year, this.formCreacion.get('fecha_limite').value.date.month, this.formCreacion.get('fecha_limite').value.date.day].join('-');
                }else{

                    var fecha_limite: any = this.formCreacion.get('fecha_limite').value;
                }

            }else{

                if(this.formCreacion.get('fecha_limite').value) {

                    var fecha_limite: any = this.formCreacion.get('fecha_limite').value.formatted;

                }else{

                    var fecha_limite: any = this.formCreacion.get('fecha_limite').value;
                }

            }
            var model: any = {
                id_tarea_template: this.formCreacion.get('id_tarea_template').value,
                titulo: this.formCreacion.get('titulo').value,
                descripcion: descripcion,
                fecha_limite: fecha_limite,
                fecha_ejecucion: this.formCreacion.get('fecha_ejecucion').value.formatted,
                urgente: this.formCreacion.get('urgente').value,
                falta_info: this.formCreacion.get('falta_info').value,
                prioridad: this.formCreacion.get('prioridad').value,
                id_cliente: this.formCreacion.get('id_cliente').value,
                id_servicio: this.formCreacion.get('id_servicio').value,
                id_asignado: this.formCreacion.get('id_asignado').value,
                id_tipo_tarea: this.formCreacion.get('id_tipo_tarea').value,
                borrador: 1,
            }
            this.loader= true;
            this.servicio.create(model)
            .subscribe(
                data => {
                    this.hideModalCrear();
                    this.modificar = false;
                    this.loadFilter();
                    this.toastyService.success("La tarea fue guardada en borrador");
                    this.loader= false;
                    this.resetCreateForm();
                    this.isSubmitTarea= false;
                },
                error => {
                    this.alert_server.messageError(error);
                    this.loader= false;
                    this.isSubmitTarea= false;
                }
            );
        }else{
            // VALIDAR ANTES DE POST
            this.formCreacion= this.fb.group({
                id_tarea_template: this.formCreacion.get('id_tarea_template').value,
                titulo: [this.formCreacion.get('titulo').value, Validators.compose([
                    Validators.required,
                    Validators.maxLength(50),
                    Validaciones.verificarEspacios,
                ])],
                descripcion: this.formCreacion.get('descripcion').value,
                fecha_limite: this.fechaLimiteCreate,
                fecha_ejecucion: this.formCreacion.get('fecha_ejecucion').value,
                urgente: this.formCreacion.get('urgente').value,
                falta_info: this.formCreacion.get('falta_info').value,
                prioridad: this.formCreacion.get('prioridad').value,
                id_cliente: this.formCreacion.get('id_cliente').value,
                id_servicio: this.formCreacion.get('id_servicio').value,
                id_asignado: this.formCreacion.get('id_asignado').value,
                id_tipo_tarea: this.formCreacion.get('id_tipo_tarea').value,
            })
        }
    }

    // GUARDAR DEFINITIVO
    create(){
        this.llenarFormTareaCreate();
        this.status= 1;
        this.isSubmitTarea= true;
        if(this.formCreacion.get('titulo').valid && this.formCreacion.get('descripcion').valid && this.formCreacion.get('fecha_limite').valid && this.formCreacion.get('urgente').valid && this.formCreacion.get('falta_info').valid && this.formCreacion.get('id_asignado').valid && this.formCreacion.get('prioridad').valid && this.isSubmitTarea) {

            if(this.selectTT) {

                if(this.formCreacion.get('fecha_limite').value) {
                    var fecha_limite: any = [this.formCreacion.get('fecha_limite').value.date.year, this.formCreacion.get('fecha_limite').value.date.month, this.formCreacion.get('fecha_limite').value.date.day].join('-');
                }else{

                    var fecha_limite: any = this.formCreacion.get('fecha_limite').value;
                }

            }else{

                if(this.formCreacion.get('fecha_limite').value) {

                    var fecha_limite: any = this.formCreacion.get('fecha_limite').value.formatted;

                }else{

                    var fecha_limite: any = this.formCreacion.get('fecha_limite').value;
                }

            }
            var model: any = {
                id_tarea_template: this.formCreacion.get('id_tarea_template').value,
                titulo: this.formCreacion.get('titulo').value,
                descripcion: this.formCreacion.get('descripcion').value,
                fecha_limite: fecha_limite,
                fecha_ejecucion: this.formCreacion.get('fecha_ejecucion').value.formatted,
                urgente: this.formCreacion.get('urgente').value,
                falta_info: this.formCreacion.get('falta_info').value,
                prioridad: this.formCreacion.get('prioridad').value,
                id_cliente: this.formCreacion.get('id_cliente').value,
                id_servicio: this.formCreacion.get('id_servicio').value,
                id_asignado: this.formCreacion.get('id_asignado').value,
                id_tipo_tarea: this.formCreacion.get('id_tipo_tarea').value,
                create: 1,
            }
            this.loader= true;
            this.servicio.create(model)
            .subscribe(
                data => {
                    this.hideModalCrear();
                    this.modificar = false;
                    this.loadFilter();
                    this.toastyService.success("La tarea fue creada exitosamente");
                    this.loader= false;
                    this.resetCreateForm();
                    this.isSubmitTarea= false;
                },
                error => {
                    this.alert_server.messageError(error);
                    this.loader= false;
                    this.isSubmitTarea= false;
                }
            );

        }else{
            // VALIDAR ANTES DE POST
            this.formCreacion= this.fb.group({
                id_tarea_template: this.formCreacion.get('id_tarea_template').value,
                titulo: [this.formCreacion.get('titulo').value, Validators.compose([
                    Validators.required,
                    Validators.maxLength(50),
                    Validaciones.verificarEspacios,
                ])],
                descripcion: [this.formCreacion.get('descripcion').value, Validators.compose([
                    Validaciones.verificarEspacios,
                ])],
                fecha_limite: [this.formCreacion.get('fecha_limite').value, Validators.compose([
                    Validators.required,
                ])],
                fecha_ejecucion: this.formCreacion.get('fecha_ejecucion').value,
                urgente: [this.formCreacion.get('urgente').value, Validators.compose([
                    Validators.required,
                ])],
                falta_info: [this.formCreacion.get('falta_info').value, Validators.compose([
                    Validators.required,
                ])],
                prioridad: [this.formCreacion.get('prioridad').value, Validators.compose([
                    Validators.required,
                ])],
                id_cliente: this.formCreacion.get('id_cliente').value,
                id_servicio: this.formCreacion.get('id_servicio').value,
                id_asignado: [this.formCreacion.get('id_asignado').value, Validators.compose([
                    Validators.required,
                ])],
                id_tipo_tarea: [this.formCreacion.get('id_tipo_tarea').value, Validators.compose([
                    Validators.required,
                ])],
            })
        }
    }

    // INSTANCIAR FORMULARIO CON DATOS
    llenarFormTareaCreate(){
      this.formCreacion= this.fb.group({
          id_tarea_template: this.formCreacion.get('id_tarea_template').value,
          titulo: [this.formCreacion.get('titulo').value, Validators.compose([
              Validators.required,
              Validators.maxLength(50),
              Validaciones.verificarEspacios,
          ])],
          descripcion: [this.formCreacion.get('descripcion').value, Validators.compose([
              Validators.required,
              Validaciones.verificarEspacios,
          ])],
          fecha_limite: [this.formCreacion.get('fecha_limite').value, Validators.compose([
              Validators.required,
          ])],
          fecha_ejecucion: this.formCreacion.get('fecha_ejecucion').value,
          urgente: [this.formCreacion.get('urgente').value, Validators.compose([
              Validators.required,
          ])],
          falta_info: [this.formCreacion.get('falta_info').value, Validators.compose([
              Validators.required,
          ])],
          prioridad: [this.formCreacion.get('prioridad').value, Validators.compose([
              Validators.required,
          ])],
          id_cliente: this.formCreacion.get('id_cliente').value,
          id_servicio: this.formCreacion.get('id_servicio').value,
          id_asignado: [this.formCreacion.get('id_asignado').value, Validators.compose([
              Validators.required,
          ])],
          id_tipo_tarea: [this.formCreacion.get('id_tipo_tarea').value, Validators.compose([
              Validators.required,
          ])],
      })
    }

    // RECIBIR FILA DE TAREAS Y MOSTRAR EN FORMULARIO DE EDICION
    showModalEditar(tareas: Tarea, index: number){
        this.modalEditar.show();
        this.editTarea= tareas;
        this.posicionList= index;
        this.verificarDescripcion= tareas.descripcion;
        this.onSelectCliente(tareas.id_cliente);

        if (tareas.workflow_name == "WorkflowGeneral") {

          this.workflowName= "Workflow General";

        }else if(tareas.workflow_name == "WorkflowIngresoCliente"){

          this.workflowName= "Workflow Ingreso de Cliente";

        }else if(tareas.workflow_name == "WorkflowServicio"){

          this.workflowName= null;
          this.nombreServicioWorkflow= tareas.nombre_servicio;

        }

        var id_tarea_template: any;
        var id_cliente: any;
        var id_servicio: any;
        var id_asignado: any;
        var prioridad: any;
        var fechaEjecucionObjeto: Object;
        var fechaLimiteObjeto: Object;
        var fechaEjecucionModel: Date;
        var fechaLimiteModel: Date;

        // VERIFICAR SI ES NULO
        if(tareas.id_tarea_template == null) {
            id_tarea_template= '';
        }else{
            id_tarea_template= tareas.id_tarea_template;
        }

        //VERIFICAR SI ES urgente_filtro
        if (tareas.prioridad == null) {
          prioridad= '';
        }else{
          prioridad= tareas.prioridad;
        }

        // VERIFICAR SI ES NULO
        if(tareas.id_cliente == null) {
            id_cliente= '';
        }else{
            id_cliente= tareas.id_cliente;
        }

        // VERIFICAR SI ES NULO
        if(tareas.id_servicio == null) {
            id_servicio= '';
        }else{
            id_servicio= tareas.id_servicio;
        }

        // VERIFICAR SI ES NULO
        if(tareas.id_asignado == null) {
            id_asignado= '';
        }else{
            id_asignado= tareas.id_asignado;
        }

        // VERIFICAR SI ES NULO
        if(tareas.fecha_limite_edit == null) {
            fechaLimiteModel = null;
        }else{
            fechaLimiteModel= new Date(tareas.fecha_limite_edit);
            fechaLimiteObjeto = { date: { year: fechaLimiteModel.getUTCFullYear(), month: fechaLimiteModel.getUTCMonth() + 1, day: fechaLimiteModel.getUTCDate()} };
        }

        // VERIFICAR SI ES NULO
        if(tareas.fecha_ejecucion_edit == null) {
            fechaEjecucionModel = null;
        }else{
            fechaEjecucionModel= new Date(tareas.fecha_ejecucion_edit);
            fechaEjecucionObjeto = { date: { year: fechaEjecucionModel.getUTCFullYear(), month: fechaEjecucionModel.getUTCMonth() + 1, day: fechaEjecucionModel.getUTCDate()} };
        }

        this.formEdicion= this.fb.group({
            titulo2: [tareas.titulo, Validators.compose([
                Validators.required,
                Validators.maxLength(50),
                Validaciones.verificarEspacios,
            ])],
            descripcion2: [tareas.descripcion, Validators.compose([
                Validaciones.verificarEspacios,
            ])],
            fecha_limite2: [fechaLimiteObjeto, Validators.compose([
                Validators.required,
            ])],
            fecha_ejecucion2: fechaEjecucionObjeto,
            urgente2: [tareas.urgente, Validators.compose([
                Validators.required,
            ])],
            falta_info2: [tareas.falta_info, Validators.compose([
                Validators.required,
            ])],
            prioridad2: [prioridad, Validators.compose([
                Validators.required,
            ])],
            id_cliente2: id_cliente,
            id_servicio2: id_servicio,
            id_asignado2: [id_asignado, Validators.compose([
                Validators.required,
            ])],
            estado2: tareas.estado,
            id_tipo_tarea2: [tareas.id_tipo_tarea, Validators.compose([
                Validators.required,
            ])],
        })
        this.verValidacion= false;
    }

    // VERIFICACION DE CAMBIOS EN FORMULARIO DE EDICION
    verificarCambio(){
        this.modificar= true;
    }

    // CAPTURAR EVENTO DE CERRAR MODAL DE EDICION
    hideModalEditar(){
        if(this.modificar ==  true) {
            $('#confirmar-cambios').modal('show');
        }else{
            this.modalEditar.hide();
            this.modificar = false;
            this.isSubmitTarea= false;
            this.verValidacion= false;
            this.resetEditForm();
            this.workflowName= null;
            this.nombreServicioWorkflow= null;
        }
    }

    // SALIR DE LA EDICION Y GUARDAR
    salirGuardar(){
        if(this.editTarea.estado == 'Borrador') {
            this.borradorEdit();
        }else{
            this.edit();
        }
        $('#confirmar-cambios').modal('hide');
        this.workflowName= null;
        this.nombreServicioWorkflow= null;
    }

    // SALIR DE LA EDICION Y NO GUARDAR
    salirSinGuardar(){
        $('#confirmar-cambios').modal('hide');
        $('#editar-tarea').find('form').trigger('reset');
        this.modalEditar.hide();
        this.modificar = false;
        this.isSubmitTarea= false;
        this.verValidacion= false;
        this.resetEditForm();
        this.workflowName= null;
        this.nombreServicioWorkflow= null;
    }

    // ACTUALIZAR REGISTRO EN LA LISTA
    actualizarListaEdicion(data: Tarea[]){
        this.transformarHTML(data);
        this.listTareas[this.posicionList]= data[0];
    }

    //RESETEAR FORMULARIO CREACION
    resetEditForm(){
      this.formEdicion.reset({
          titulo2: '',
          descripcion2: '',
          fecha_limite2: '',
          fecha_ejecucion2: '',
          urgente2: '',
          falta_info2: '',
          prioridad2: '',
          id_cliente2: '',
          id_servicio2: '',
          id_asignado2: '',
          id_tipo_tarea2: '',
      })
    }

    // GUARDAR BORRADOR DEL FORMULARIO DE EDICION
    borradorEdit(){
        this.status= 0;
        this.isSubmitTarea= true;
        if(this.formEdicion.get('titulo2').valid && this.isSubmitTarea) {

            if(this.formEdicion.get('descripcion2').value) {

                var descripcion= this.formEdicion.get('descripcion2').value.trim();

            }else{

                var descripcion= this.formEdicion.get('descripcion2').value;
            }

            if(this.formEdicion.get('fecha_ejecucion2').value) {

                var fechaEjecucionEdit= [this.formEdicion.get('fecha_ejecucion2').value.date.year, this.formEdicion.get('fecha_ejecucion2').value.date.month, this.formEdicion.get('fecha_ejecucion2').value.date.day].join('-');

            }else{

                var fechaEjecucionEdit= '';

            }

            if(this.formEdicion.get('fecha_limite2').value) {

                var fechaLimiteEdit= [this.formEdicion.get('fecha_limite2').value.date.year, this.formEdicion.get('fecha_limite2').value.date.month, this.formEdicion.get('fecha_limite2').value.date.day].join('-');

            }else{

                var fechaLimiteEdit= '';

            }

            var model: any = {
                id: this.editTarea.id,
                titulo: this.formEdicion.get('titulo2').value,
                workflow_name: this.editTarea.workflow_name,
                descripcion: descripcion,
                fecha_limite: fechaLimiteEdit,
                fecha_ejecucion: fechaEjecucionEdit,
                urgente: this.formEdicion.get('urgente2').value,
                falta_info: this.formEdicion.get('falta_info2').value,
                prioridad: this.formEdicion.get('prioridad2').value,
                id_cliente: this.formEdicion.get('id_cliente2').value,
                id_servicio: this.formEdicion.get('id_servicio2').value,
                id_asignado: this.formEdicion.get('id_asignado2').value,
                id_tipo_tarea: this.formEdicion.get('id_tipo_tarea2').value,
                estado: this.formEdicion.get('estado2').value,
                borrador: 1,
            }
            this.loader= true;
            this.servicio.update(model)
            .subscribe(
                data => {
                    this.modalEditar.hide();
                    this.modificar = false;
                    this.actualizarListaEdicion(data);
                    this.verValidacion= false;
                    this.toastyService.info("La tarea fue guardada en borrador");
                    this.loader= false;
                    this.resetEditForm();
                    this.isSubmitTarea= false;
                    this.workflowName= null;
                    this.nombreServicioWorkflow= null;
                },
                error => {
                    this.alert_server.messageError(error);
                    this.loader= false;
                    this.isSubmitTarea= false;
                }
            );
        }else{
            // VALIDAR ANTES DE POST
            this.verValidacion= true;
            this.formEdicion= this.fb.group({
                titulo2: [this.formEdicion.get('titulo2').value, Validators.compose([
                    Validators.required,
                    Validators.maxLength(50),
                    Validaciones.verificarEspacios,
                ])],
                descripcion2: this.formEdicion.get('descripcion2').value,
                fecha_limite2: this.formEdicion.get('fecha_limite2').value,
                fecha_ejecucion2: this.formEdicion.get('fecha_ejecucion2').value,
                urgente2: this.formEdicion.get('urgente2').value,
                falta_info2: this.formEdicion.get('falta_info2').value,
                prioridad2: this.formEdicion.get('prioridad2').value,
                id_cliente2: this.formEdicion.get('id_cliente2').value,
                id_servicio2: this.formEdicion.get('id_servicio2').value,
                id_asignado2: this.formEdicion.get('id_asignado2').value,
                id_tipo_tarea2: this.formEdicion.get('id_tipo_tarea2').value,
                estado2: this.formEdicion.get('estado2').value,
            })
        }
    }

    // FORMULARIO DE EDICION
    // GUARDAR DEFINITIVO DEL FORMULARIO DE EDICION
    createEdit(){
        this.status= 1;
        this.isSubmitTarea= true;
        if(this.formEdicion.get('titulo2').valid && this.formEdicion.get('descripcion2').valid && this.formEdicion.get('fecha_limite2').valid && this.formEdicion.get('urgente2').valid && this.formEdicion.get('falta_info2').valid && this.formEdicion.get('prioridad2').valid && this.formEdicion.get('id_asignado2').valid && this.formEdicion.get('estado2').valid && this.formEdicion.get('id_tipo_tarea2').valid && this.isSubmitTarea) {

            if(this.formEdicion.get('fecha_ejecucion2').value) {

                var fechaEjecucionEdit= [this.formEdicion.get('fecha_ejecucion2').value.date.year, this.formEdicion.get('fecha_ejecucion2').value.date.month, this.formEdicion.get('fecha_ejecucion2').value.date.day].join('-');

            }else{

                var fechaEjecucionEdit= '';

            }

            if(this.formEdicion.get('fecha_limite2').value) {

                var fechaLimiteEdit= [this.formEdicion.get('fecha_limite2').value.date.year, this.formEdicion.get('fecha_limite2').value.date.month, this.formEdicion.get('fecha_limite2').value.date.day].join('-');

            }else{

                var fechaLimiteEdit= '';

            }

            var model: any = {
                id: this.editTarea.id,
                titulo: this.formEdicion.get('titulo2').value,
                workflow_name: this.editTarea.workflow_name,
                descripcion: this.formEdicion.get('descripcion2').value,
                fecha_limite: fechaLimiteEdit,
                fecha_ejecucion: fechaEjecucionEdit,
                urgente: this.formEdicion.get('urgente2').value,
                falta_info: this.formEdicion.get('falta_info2').value,
                prioridad: this.formEdicion.get('prioridad2').value,
                id_cliente: this.formEdicion.get('id_cliente2').value,
                id_servicio: this.formEdicion.get('id_servicio2').value,
                id_asignado: this.formEdicion.get('id_asignado2').value,
                id_tipo_tarea: this.formEdicion.get('id_tipo_tarea2').value,
                estado: this.formEdicion.get('estado2').value,
                create: 1,
            }
            this.loader= true;
            this.servicio.update(model)
            .subscribe(
                data => {
                    this.modalEditar.hide();
                    this.modificar = false;
                    this.actualizarListaEdicion(data);
                    this.verValidacion= false;
                    this.toastyService.info("La tarea fue creada exitosamente");
                    this.loader= false;
                    this.resetEditForm();
                    this.isSubmitTarea= false;
                    this.workflowName= null;
                    this.nombreServicioWorkflow= null;
                },
                error => {
                    this.alert_server.messageError(error);
                    this.loader= false;
                    this.isSubmitTarea= false;
                }
            );
        }else{
            // VALIDAR ANTES DE POST
            this.verValidacion= true;
            this.formEdicion= this.fb.group({
                titulo2: [this.formEdicion.get('titulo2').value, Validators.compose([
                    Validators.required,
                    Validators.maxLength(50),
                    Validaciones.verificarEspacios,
                ])],
                descripcion2: [this.formEdicion.get('descripcion2').value, Validators.compose([
                    Validaciones.verificarEspacios,
                ])],
                fecha_limite2: [this.formEdicion.get('fecha_limite2').value, Validators.compose([
                    Validators.required,
                ])],
                fecha_ejecucion2: this.formEdicion.get('fecha_ejecucion2').value,
                urgente2: [this.formEdicion.get('urgente2').value, Validators.compose([
                    Validators.required,
                ])],
                falta_info2: [this.formEdicion.get('falta_info2').value, Validators.compose([
                    Validators.required,
                ])],
                prioridad2: [this.formEdicion.get('prioridad2').value, Validators.compose([
                    Validators.required,
                ])],
                id_cliente2: this.formEdicion.get('id_cliente2').value,
                id_servicio2: this.formEdicion.get('id_servicio2').value,
                id_asignado2: [this.formEdicion.get('id_asignado2').value, Validators.compose([
                    Validators.required,
                ])],
                estado2: this.formEdicion.get('estado2').value,
                id_tipo_tarea2: [this.formEdicion.get('id_tipo_tarea2').value, Validators.compose([
                    Validators.required,
                ])],
            })
        }

    }

    // PUT TAREAS

    edit() {
        this.status= 1;
        this.isSubmitTarea= true;
        if((this.formEdicion.get('estado2').value) == 'Borrador') {

            this.borradorEdit();

        }else{

            if(this.formEdicion.get('titulo2').valid && this.formEdicion.get('descripcion2').valid && this.formEdicion.get('fecha_limite2').valid && this.formEdicion.get('urgente2').valid && this.formEdicion.get('falta_info2').valid && this.formEdicion.get('prioridad2').valid && this.formEdicion.get('id_asignado2').valid && this.formEdicion.get('estado2').valid && this.formEdicion.get('id_tipo_tarea2').valid && this.isSubmitTarea) {

                if(this.formEdicion.get('fecha_ejecucion2').value) {

                    var fechaEjecucionEdit= [this.formEdicion.get('fecha_ejecucion2').value.date.year, this.formEdicion.get('fecha_ejecucion2').value.date.month, this.formEdicion.get('fecha_ejecucion2').value.date.day].join('-');

                }else{

                    var fechaEjecucionEdit= '';

                }

                if(this.formEdicion.get('fecha_limite2').value) {

                    var fechaLimiteEdit= [this.formEdicion.get('fecha_limite2').value.date.year, this.formEdicion.get('fecha_limite2').value.date.month, this.formEdicion.get('fecha_limite2').value.date.day].join('-');

                }else{

                    var fechaLimiteEdit= '';

                }

                var model: any = {
                    id: this.editTarea.id,
                    titulo: this.formEdicion.get('titulo2').value,
                    workflow_name: this.editTarea.workflow_name,
                    descripcion: this.formEdicion.get('descripcion2').value,
                    fecha_limite: fechaLimiteEdit,
                    fecha_ejecucion: fechaEjecucionEdit,
                    urgente: this.formEdicion.get('urgente2').value,
                    falta_info: this.formEdicion.get('falta_info2').value,
                    prioridad: this.formEdicion.get('prioridad2').value,
                    id_cliente: this.formEdicion.get('id_cliente2').value,
                    id_servicio: this.formEdicion.get('id_servicio2').value,
                    id_asignado: this.formEdicion.get('id_asignado2').value,
                    id_tipo_tarea: this.formEdicion.get('id_tipo_tarea2').value,
                    estado: this.formEdicion.get('estado2').value,
                    fecha_primera_reunion: null,
                    edit: 1,
                }

                this.modelTareaEdicion= model;

                if(model.estado == 'Completada' && this.editTarea.titulo == 'Coordinar la reunión inicial' && this.editTarea.workflow_name == "WorkflowIngresoCliente"){

                    this.showModalIngresoFechaPrimeraReunion();

                }else if (model.estado == 'Completada' && this.editTarea.titulo == 'Reunión efectivamente realizada' && this.editTarea.workflow_name == "WorkflowIngresoCliente" && this.editTarea.estado != 'Completada'){

                  model.fecha_primera_reunion= this.editTarea.fecha_primera_reunion;
                  this.servicio.update(model)
                  .subscribe(
                      data => {
                          this.modalEditar.hide();
                          this.modificar = false;
                          this.loadFilter();
                          this.verValidacion= false;
                          this.toastyService.info("La tarea fue editada exitosamente");
                          this.loader= false;
                          this.resetEditForm();
                          this.isSubmitTarea= false;
                          this.workflowName= null;
                          this.nombreServicioWorkflow= null;
                      },
                      error => {
                          this.alert_server.messageError(error);
                          this.loader= false;
                          this.isSubmitTarea= false;
                      }
                  );

                }else{

                  this.loader= true;
                  this.servicio.update(model)
                  .subscribe(
                      data => {
                          this.modalEditar.hide();
                          this.modificar = false;
                          this.actualizarListaEdicion(data);
                          this.verValidacion= false;
                          this.toastyService.info("La tarea fue editada exitosamente");
                          this.loader= false;
                          this.resetEditForm();
                          this.isSubmitTarea= false;
                          this.workflowName= null;
                          this.nombreServicioWorkflow= null;
                      },
                      error => {
                          this.alert_server.messageError(error);
                          this.loader= false;
                          this.isSubmitTarea= false;
                      }
                  );

                }

            }else{
                // VALIDAR ANTES DE PUT
                this.verValidacion= true;
                this.formEdicion= this.fb.group({
                    titulo2: [this.formEdicion.get('titulo2').value, Validators.compose([
                        Validators.required,
                        Validators.maxLength(50),
                        Validaciones.verificarEspacios,
                    ])],
                    descripcion2: [this.formEdicion.get('descripcion2').value, Validators.compose([
                        Validaciones.verificarEspacios,
                    ])],
                    fecha_limite2: [this.formEdicion.get('fecha_limite2').value, Validators.compose([
                        Validators.required,
                    ])],
                    fecha_ejecucion2: this.formEdicion.get('fecha_ejecucion2').value,
                    urgente2: [this.formEdicion.get('urgente2').value, Validators.compose([
                        Validators.required,
                    ])],
                    falta_info2: [this.formEdicion.get('falta_info2').value, Validators.compose([
                        Validators.required,
                    ])],
                    prioridad2: [this.formEdicion.get('prioridad2').value, Validators.compose([
                        Validators.required,
                    ])],
                    id_cliente2: [this.formEdicion.get('id_cliente2').value, Validators.compose([
                        Validators.required,
                    ])],
                    id_servicio2: [this.formEdicion.get('id_servicio2').value, Validators.compose([
                        Validators.required,
                    ])],
                    id_asignado2: [this.formEdicion.get('id_asignado2').value, Validators.compose([
                        Validators.required,
                    ])],
                    estado2: this.formEdicion.get('estado2').value,
                    id_tipo_tarea2: [this.formEdicion.get('id_tipo_tarea2').value, Validators.compose([
                        Validators.required,
                    ])],
                })
            }

        }
    }

    // FECHA PRIMERA REUNION
    showModalIngresoFechaPrimeraReunion(){
      this.modalFechaPrimeraReunion.show();
      this.formIngresoFechaPrimeraReunion= this.fb.group({
          fecha_primera_reunion: ['', Validators.compose([
              Validators.required,
          ])],
      })
    }

    // CERRAR MODAL SUBTAREAS
    hideModalIngresoFechaPrimeraReunion():void {
        this.modalFechaPrimeraReunion.hide();
        this.isSubmitFechaComienzo= false;
    }

    // GUARDAR FECHA PRIMERA REUNION
    ingresarFechaPrimeraReunion(){
      this.isSubmitFechaComienzo= true;
      if (this.formIngresoFechaPrimeraReunion.valid && this.isSubmitFechaComienzo) {

        this.modelTareaEdicion.fecha_primera_reunion= this.formIngresoFechaPrimeraReunion.get('fecha_primera_reunion').value.formatted;
        this.servicio.update(this.modelTareaEdicion)
        .subscribe(
            data => {
                this.modalEditar.hide();
                this.modalFechaPrimeraReunion.hide();
                this.modificar = false;
                this.loadFilter();
                this.verValidacion= false;
                this.toastyService.info("La tarea fue editada exitosamente");
                this.loader= false;
                this.resetEditForm();
                this.isSubmitTarea= false;
                this.isSubmitFechaComienzo= false;
            },
            error => {
                this.alert_server.messageError(error);
                this.loader= false;
                this.isSubmitTarea= false;
            }
        );

      }else{
        this.formIngresoFechaPrimeraReunion= this.fb.group({
            fecha_primera_reunion: [this.formIngresoFechaPrimeraReunion.get('fecha_primera_reunion').value, Validators.compose([
                Validators.required,
            ])],
        })
      }
    }

    // ACTUALIZAR LISTA ELIMINACION
    actualizarListaEliminacion(){
        this.listTareas.splice(this.posicionList, 1);
    }

    // ELIMINAR TAREAS
    onDelete(tareas: Tarea, index: number){
        this.deleteTareas= tareas;
        this.posicionList= index;
    }

    deleteTarea(){
        this.loader= true;
        this.servicio.delete(this.deleteTareas.id)
        .subscribe(
            data => {
                this.actualizarListaEliminacion();
                $('#eliminar-tarea').modal('hide');
                this.toastyService.error("La tarea fue eliminada exitosamente");
                this.loader= false;
            },
            error => {
                this.alert_server.messageError(error);
                this.loader= false;
            }
        );
    }

    // ABRIR MODAL SUBTAREAS
    showModalSubtareas(id: number){
        this.modalSubtareas.show();
        this.idSubtarea= id;
        this.loadSubtareas();
        this.loadCantidadSubtareas(this.idSubtarea);
        this.createFormSubtarea();
    }

    // CERRAR MODAL SUBTAREAS
    hideModalSubtareas():void {
        this.modalSubtareas.hide();
        this.isSubmitSubtarea= false;
        this.resetSubtareaFrom();
    }

    resetSubtareaFrom(){
      this.formSubtareas.reset({
          titulo: '',
          descripcion: '',
          completa: '',
      })
    }

    // FORMULARIO DE SUBTAREAS
    createSubTarea(){
        this.isSubmitSubtarea= true;
        if(this.formSubtareas.get('titulo').valid && this.isSubmitSubtarea) {

            if(this.formSubtareas.get('descripcion').value) {

                var descripcion= this.formSubtareas.get('descripcion').value.trim();

            }else{

                var descripcion= this.formSubtareas.get('descripcion').value;

            }

            var model: any = {
                titulo: this.formSubtareas.get('titulo').value.trim(),
                descripcion: descripcion,
                id_tarea: this.idSubtarea,
            }
            this.servicio.createSubtareas(model)
            .subscribe(
                data => {
                    this.loadSubtareas();
                    this.loadCantidadSubtareas(this.idSubtarea);
                    this.toastyService.success("La subtarea fue creada exitosamente");
                    this.isSubmitSubtarea= false;
                    this.resetSubtareaFrom();
                },
                error => {
                    this.alert_server.messageError(error);
                    this.isSubmitSubtarea= false;
                }
            );

        }else{
            // VALIDAR ANTES DE POST
            this.formSubtareas= this.fb.group({
                titulo: [this.formSubtareas.get('titulo').value, Validators.compose([
                    Validators.required,
                    Validators.maxLength(50),
                    Validaciones.verificarEspacios,
                ])],
                descripcion: this.formSubtareas.get('descripcion').value,
                completa: '',
            })
        }

    }

    // EDICION DE GRILLA SUBTAREAS
    saveToDatabase(editableObj: any, column: any, id: number){

        if(column == 'titulo' || column == 'descripcion') {

            var valor= editableObj.target.innerHTML.trim();

        }else{

            var valor= editableObj.target.value;

        }

        if(valor == '' && column == 'titulo') {

            this.toastyService.error("Los campos de las subtareas son requeridos");

        }else{

            $(editableObj.target).css("background","#FFF url(data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==) no-repeat right");
            var model: any = {
                column: column,
                editval: valor,
                id: id,
                id_tarea: this.idSubtarea,
            }
            this.servicio.editSubtarea(model)
            .subscribe(
                data => {
                    this.loadSubtareas();
                    this.loadCantidadSubtareas(this.idSubtarea);
                    if(column == 'completa') {
                        this.toastyService.warning("Se cambio el estado de la subtarea exitosamente");
                    }
                    this.isSubmitSubtarea= false;
                    this.resetSubtareaFrom();
                },
                error => {
                    this.alert_server.messageError(error);
                    this.isSubmitSubtarea= false;
                }
            );

        }

    }

    // ELIMINAR SUBTAREAS
    onDeleteSubtarea(subtareas: any){
        this.deleteSubtareas= subtareas;
    }

    deleteSubtarea(){
        var model: any= {
            id: this.deleteSubtareas.id,
            id_tarea: this.idSubtarea,
        }
        this.servicio.deleteSubtarea(model)
        .subscribe(
            data => {
                $('#eliminar-subtarea').modal('hide');
                this.isSubmitSubtarea= false;
                this.resetSubtareaFrom();
                this.loadSubtareas();
                this.loadCantidadSubtareas(this.idSubtarea);
                this.toastyService.error("La subtarea fue eliminada exitosamente");
            },
            error => {
                this.alert_server.messageError(error);
            }
        );
    }

    // CAMBIO A VISTA COMPLETA
    vistaCompleta(){
        this.vista= 1;
    }

    // CAMBIO A VISTA SIMPLE
    vistaSimple(){
        this.vista= 0;
    }

    // CLEAN FILTROS
    cleanFilter(){
        this.resetFilter();
    }

}
