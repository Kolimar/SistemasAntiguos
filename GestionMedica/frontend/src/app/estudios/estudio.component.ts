import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, NgForm, FormGroup } from '@angular/forms';
import { EstudioService, PrestacionService, PacienteService, DoctorService } from '../services/index';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { ModalDirective } from 'ngx-bootstrap';
import { AlertServer } from '../global/index';
import { Estudio, Prestacion, Paciente, Doctor, ObraSocial, Particular, PagoParticular, PagoObraSocial } from '../models/index';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { IMyOptions } from 'mydatepicker';
import { IMyDrpOptions } from 'mydaterangepicker';
import { ApiSettings } from '../global/index';

@Component({
    moduleId: module.id,
    selector: 'estudio',
    templateUrl: './estudio.html',
    providers: [EstudioService, PrestacionService, PacienteService, DoctorService, AlertServer]
})

export class EstudioComponent implements OnInit{
  listEstudios: Estudio[]= [];
  listFiltro: any = '';
  cmbPacientes: Paciente[]= [];
  cmbDoctores: Paciente[]= [];
  cmbPrestaciones: Prestacion[]= [];
  listPagos: any[]= [];
  listPagosExtras: any[]= [];
  dataEstudio: Estudio;
  pagina: number= -1;
  totalOS: number;
  totalParticular: number;
  @ViewChild('modalCrear') public modalCrear:ModalDirective;
  @ViewChild('modalEditar') public modalEditar:ModalDirective;
  @ViewChild('modalPagos') public modalPagos:ModalDirective;
  formCreacion: FormGroup;
  formEdicion: FormGroup;
  formPago: FormGroup;
  isSubmitEstudio: boolean= false;
  loader: boolean= false;
  editEstudio: Estudio;
  deleteEstudio: Estudio;
  posicionList: number;
  modificar: boolean= false;
  selectedObraSocial: ObraSocial;
  selectedParticular: Particular;
  precioObraSocial: number
  precioParticular: number;
  habilitarGuardado: boolean= false;
  isSubmitPago: boolean;
  idPagoOS: number;
  idPagoParticular: number;
  dataPagoExtra: any;
  private urlExport: any;
  public myDatePickerOptions: IMyOptions = {
      dateFormat: 'dd-mm-yyyy',
      editableDateField: false,
      disableWeekends: true,
      selectionTxtFontSize: '1.3rem',
      dayLabels: { su: "Do", mo: "Lu", tu: "Ma", we: "Mi", th: "Ju", fr: "Vi", sa: "Sa" },
      monthLabels: { 1: "Ene", 2: "Feb", 3: "Mar", 4: "Abr", 5: "May", 6: "Jun", 7: "Jul", 8: "Ago", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dic" },
      todayBtnTxt: "Hoy",
      firstDayOfWeek: "mo",
      showInputField: true,
      openSelectorOnInputClick: true,
  }
  public myDateRangePickerOptions: IMyDrpOptions = {
      dateFormat: 'dd-mm-yyyy',
      selectionTxtFontSize: '1.3rem',
      dayLabels: { su: "Do", mo: "Lu", tu: "Ma", we: "Mi", th: "Ju", fr: "Vi", sa: "Sa" },
      monthLabels: { 1: "Ene", 2: "Feb", 3: "Mar", 4: "Abr", 5: "May", 6: "Jun", 7: "Jul", 8: "Ago", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dic" },
      firstDayOfWeek: "mo",
      openSelectorOnInputClick: true,
      editableDateRangeField: false,
      height: '29px',
      selectBeginDateTxt: 'Fecha de inicio',
      selectEndDateTxt: 'Fecha final',
      showClearDateRangeBtn: false,
      showClearBtn: false
  }
  public currencyMask = createNumberMask({
    prefix: '',
    suffix: '',
    thousandsSeparatorSymbol: '.'
  })

  // FILTROS
  fecha_filtro: string= '';
  hora_filtro: string= '';
  paciente_filtro: string= '';
  doctor_filtro: string= '';
  prestacion_filtro: string= '';
  observaciones_filtro: string= '';
  factura_filtro: string= '';
  fecha_ord: string= '';

  constructor(
    private servicio: EstudioService,
    private servicioPaciente: PacienteService,
    private servicioDoctor: DoctorService,
    private servicioPrestacion: PrestacionService,
    private router: Router,
    private fb: FormBuilder,
    private toastyService:ToastyService,
    private toastyConfig: ToastyConfig,
    private alert_server: AlertServer,
  ){

    // OPCIONES PREDETERMINADAS TASTY
    this.toastyConfig.theme = 'bootstrap';
    this.toastyConfig.timeout = 5000;
    this.toastyConfig.showClose = true;

  }

  // CARGA AUTOMATICA
  ngOnInit() {
      this.loadFilter();
      this.createForm();
      this.loadPacientes();
      this.loadDoctores();
      this.loadPrestaciones();
  }

  // CARGAR LISTADO PRESTACIONES
  loadPrestaciones(){
      this.servicioPrestacion.getCmbPrestaciones().subscribe(data => { this.cmbPrestaciones = data; });
  }

  // CARGAR LISTADO PACIETNES
  loadPacientes(){
      this.servicioPaciente.getCmbPacientes().subscribe(data => { this.cmbPacientes = data; });
  }

  // CARGAR LISTADO PACIETNES
  loadDoctores(){
      this.servicioDoctor.getCmbDoctores().subscribe(data => { this.cmbDoctores = data; });
  }

  // CARGAR BUSQUEDA EN FILTRO
  loadSearch(){
      this.search(
          this.listFiltro.fecha,
          this.listFiltro.hora,
          this.listFiltro.paciente,
          this.listFiltro.doctor,
          this.listFiltro.prestacion,
          this.listFiltro.observaciones,
          this.listFiltro.factura,
          this.listFiltro.fecha_ord
      );
  }

  // CARGAR FILTRO
  loadFilter(){
      this.filter(
        this.listFiltro.fecha,
        this.listFiltro.hora,
        this.listFiltro.paciente,
        this.listFiltro.doctor,
        this.listFiltro.prestacion,
        this.listFiltro.observaciones,
        this.listFiltro.factura,
        this.listFiltro.fecha_ord
      );
  }

  // RESETEAR FILTRO A VACIO
  resetFilter(){
    this.fecha_filtro= '';
    this.hora_filtro= '';
    this.paciente_filtro= '';
    this.doctor_filtro= '';
    this.prestacion_filtro= '';
    this.observaciones_filtro= '';
    this.factura_filtro= '';
    this.fecha_ord= '';
  }

  // APLICAR FILTRADO
  filter(fecha: string, hora: string, paciente: string, doctor: string, prestacion: string, observaciones: string, factura: string, fecha_ord: string){
      this.pagina = -1;
      this.listEstudios = [];
      this.search(fecha, hora, paciente, doctor, prestacion, observaciones, factura, fecha_ord);
  }

  // FUNCIONAMIENTO DE BOTON VER MÁS
  search(fecha: any= '', hora: string= '', paciente: string= '', doctor: string= '', prestacion: string= '', observaciones: string= '', factura: string= '', fecha_ord: string= ''){
      // TRANSFORMAR FECHAS
      if (fecha) {
        var dateI= new Date(fecha.beginJsDate);
        var fechaObject= {date: { year: dateI.getUTCFullYear(), month: dateI.getUTCMonth()+1, day: dateI.getDate() }};
        var fecha_inicio= fechaObject.date.year +"-"+ fechaObject.date.month +"-"+ fechaObject.date.day;

        var dateF= new Date(fecha.endJsDate);
        var fechaObject= {date: { year: dateF.getUTCFullYear(), month: dateF.getUTCMonth()+1, day: dateF.getDate() }};
        var fecha_final= fechaObject.date.year +"-"+ fechaObject.date.month +"-"+ fechaObject.date.day;
      }
      this.pagina++;
      var model: any = {
          fecha_inicio: fecha_inicio,
          fecha_final: fecha_final,
          hora: hora,
          paciente: paciente,
          doctor: doctor,
          prestacion: prestacion,
          observaciones: observaciones,
          factura: factura,
          fecha_ord: fecha_ord,
          pagina: this.pagina,
      }
      this.servicio.search(model).subscribe((lista)=>this.cargarLista(lista));
  }

  cargarLista(data: Estudio[]){
      this.listEstudios = this.listEstudios.concat(data);

      // URL PARA EXPORTA R A EXCEL LA ULTIMA CONSULTA
      let currentUser = JSON.parse(localStorage.getItem('currentUser'));
      var date: Date= new Date();
      this.urlExport= ApiSettings.urlApi+'export-excel-estudios?array='+JSON.stringify(this.listEstudios);
  }

  // LIMIAR FILTRO
  cleanFilter(){
      this.resetFilter();
  }

  // CREACION DE FORMULARIO DE CREACION
  createForm(){
      this.formCreacion= this.fb.group({
          fecha: ['', Validators.compose([
              Validators.required,
          ])],
          hora: ['', Validators.compose([
              Validators.required,
          ])],
          id_paciente: ['', Validators.compose([
              Validators.required,
          ])],
          id_doctor: ['', Validators.compose([
              Validators.required,
          ])],
          id_prestacion: ['', Validators.compose([
              Validators.required,
          ])],
          observaciones: ['', Validators.compose([
              Validators.required,
          ])],
          n_factura: ['', Validators.compose([
              Validators.required,
          ])],
          pago: ['', Validators.compose([
              Validators.required,
          ])],
      })
  }

  // ABRIR MODAL DE CREACION
  showModalCrear():void {
      this.modalCrear.show();
  }

  // CERRAR MODAL DE CREACION
  hideModalCrear():void {
      this.modalCrear.hide();
      this.isSubmitEstudio= false;
      this.formCreacion.reset();
      this.formCreacion.patchValue({id_paciente: '', id_doctor: '', id_prestacion: ''});
      this.selectedObraSocial= null;
      this.selectedParticular= null;
      this.precioObraSocial= null;
      this.precioParticular= null;
      this.habilitarGuardado= false;
  }

  // CAPTURAR SI ES OBRA SOCIAL O PARTICULAR
  capturarDatosPaciente(id: number){
    this.selectedObraSocial= null;
    this.selectedParticular= null;
    this.precioObraSocial= null;
    this.precioParticular= null;
    this.habilitarGuardado= false;
    for (let selected of this.cmbPacientes) {
        if (selected.id == id) {
          if (selected.obra_social != null) {
            this.selectedObraSocial= selected.obra_social;
          }else if(selected.particular != null){
            this.selectedParticular= selected.particular;
          }
        }else{
          this.formCreacion.patchValue({id_prestacion: ''});
          if (this.formEdicion) {
            this.formEdicion.patchValue({id_prestacion: ''});
          }
        }
    }
  }

  // CAPTURAR DATOS DE LA PRESTACION
  capturarDatosPrestacion(id: number){
    this.precioObraSocial= null;
    this.precioParticular= null;
    this.habilitarGuardado= false;
    this.formCreacion.patchValue({pago: ''});
    if (this.formEdicion) {
      this.formEdicion.patchValue({pago: ''});
    }
    for(let selected of this.cmbPrestaciones){
      if (selected.id == id) {
        if (selected.obras_sociales.length > 0 && this.selectedObraSocial) {
          if (selected.obras_sociales[0].id == this.selectedObraSocial.id) {
            this.precioObraSocial= selected.obras_sociales[0].pivot.precio;
            this.habilitarGuardado= true;
            this.formCreacion.patchValue({pago: this.precioObraSocial});
            if (this.formEdicion) {
              this.formEdicion.patchValue({pago: this.precioObraSocial});
            }
          }
        }else if(selected.particulares.length > 0 && this.selectedParticular){
          if (selected.particulares[0].id == this.selectedParticular.id) {
            this.precioParticular= selected.particulares[0].pivot.precio;
            this.habilitarGuardado= true;
            this.formCreacion.patchValue({pago: this.precioParticular});
            if (this.formEdicion) {
              this.formEdicion.patchValue({pago: this.precioParticular});
            }
          }
        }

      }
    }
  }

  // POST ROL DE CONTACTO
  create() {
      this.isSubmitEstudio= true;
      if(this.formCreacion.valid && this.isSubmitEstudio){
          var selected: string;
          var data: any;
          var precio: any;
          if (this.selectedParticular) {

              selected= 'particular';
              data= this.selectedParticular.id;
              precio= this.precioParticular;

          }else if(this.selectedObraSocial){

              selected= 'os';
              data= this.selectedObraSocial.id;
              precio= this.precioObraSocial;

          }
          var model: any = {
              fecha: this.formCreacion.get('fecha').value.formatted,
              hora: this.formCreacion.get('hora').value.trim(),
              id_paciente: this.formCreacion.get('id_paciente').value,
              id_doctor: this.formCreacion.get('id_doctor').value,
              id_prestacion: this.formCreacion.get('id_prestacion').value,
              observaciones: this.formCreacion.get('observaciones').value.trim(),
              n_factura: this.formCreacion.get('n_factura').value.trim(),
              pago: this.formCreacion.get('pago').value,
              tipo: selected,
              idSelected: data,
              precioSelected: precio
          }
          this.loader= true;
          this.servicio.create(model)
          .subscribe(
              data => {
                  this.hideModalCrear();
                  this.loadFilter();
                  this.toastyService.success("El estudio fue creado exitosamente");
                  this.loader= false;
                  this.isSubmitEstudio= false;
                  this.formCreacion.reset();
                  this.formCreacion.patchValue({id_paciente: '', id_doctor: '', id_prestacion: ''})
              },
              error => {
                  this.alert_server.messageError(error);
                  this.loader= false;
                  this.isSubmitEstudio= false;
              }
          );
      }else{
          // VALIDACION ANTES DE POST
          this.formCreacion= this.fb.group({
              fecha: [this.formCreacion.get('fecha').value, Validators.compose([
                  Validators.required,
              ])],
              hora: [this.formCreacion.get('hora').value, Validators.compose([
                  Validators.required,
              ])],
              id_paciente: [this.formCreacion.get('id_paciente').value, Validators.compose([
                  Validators.required,
              ])],
              id_doctor: [this.formCreacion.get('id_doctor').value, Validators.compose([
                  Validators.required,
              ])],
              id_prestacion: [this.formCreacion.get('id_prestacion').value, Validators.compose([
                  Validators.required,
              ])],
              observaciones: [this.formCreacion.get('observaciones').value, Validators.compose([
                  Validators.required,
              ])],
              n_factura: [this.formCreacion.get('n_factura').value, Validators.compose([
                  Validators.required,
              ])],
              pago: [this.formCreacion.get('pago').value, Validators.compose([
                  Validators.required,
              ])],
          })
      }
  }

  // RECIBIR FILA DE TAREAS Y MOSTRAR EN FORMULARIO DE EDICION
  showModalEditar(data: Estudio, index: number){
      this.modalEditar.show();
      this.editEstudio= data;
      this.posicionList= index;
      this.capturarDatosPaciente(data.id_paciente);
      this.capturarDatosPrestacion(data.id_prestacion);

      // TRANSFORMAR FECHA EN OBJETO PARA MOSTRAT EN DATEPICKER
      var newFecha= new Date(data.fecha);
      var fechaObjeto = { date: { year: newFecha.getUTCFullYear(), month: newFecha.getUTCMonth() + 1, day: newFecha.getUTCDate() } };

      if (data.id_paciente) {
          var paciente: any = data.id_paciente;
      }else{
          var paciente: any = '';
      }

      if (data.id_doctor) {
          var doctor: any = data.id_doctor;
      }else{
          var doctor: any = '';
      }

      if (data.id_prestacion) {
          var prestacion: any = data.id_prestacion;
      }else{
          var prestacion: any = '';
      }

      this.formEdicion= this.fb.group({
          fecha: [fechaObjeto, Validators.compose([
              Validators.required,
          ])],
          hora: [data.hora, Validators.compose([
              Validators.required,
          ])],
          id_paciente: [{value: paciente, disabled: true}, Validators.compose([
              Validators.required,
          ])],
          id_prestacion: [{value: prestacion, disabled: true}, Validators.compose([
              Validators.required,
          ])],
          id_doctor: [doctor, Validators.compose([
              Validators.required,
          ])],
          observaciones: [data.observaciones, Validators.compose([
              Validators.required,
          ])],
          n_factura: [data.n_factura, Validators.compose([
              Validators.required,
          ])],
      })
  }

  // VERIFICACION DE CAMBIOS EN FORMULARIO DE EDICION
  verificarCambio(){
      this.modificar= true;
  }

  // CAPTURAR EVENTO DE CERRAR MODAL DE EDICION
  hideModalEditar():void {
      if(this.modificar ==  true) {
          $('#confirmar-cambios').modal('show');
      }else{
          this.modalEditar.hide();
          this.modificar = false;
          this.isSubmitEstudio= false;
          this.formEdicion.reset();
      }
  }

  // SALIR DE LA EDICION Y GUARDAR
  salirGuardar(){
      this.edit();
      $('#confirmar-cambios').modal('hide');
  }

  // SALIR DE LA EDICION Y NO GUARDAR

  salirSinGuardar(){
      $('#confirmar-cambios').modal('hide');
      this.modalEditar.hide();
      this.modificar = false;
      this.isSubmitEstudio= false;
      this.formEdicion.reset();
  }

  // ACTUALIZAR REGISTRO EN LA LISTA
  actualizarListaEdicion(data: Estudio[]){
      this.listEstudios[this.posicionList]= data[0];
  }

  // PUT TAREAS TEMPLATES
  edit() {
      this.isSubmitEstudio= true;
      if(this.formEdicion.valid && this.isSubmitEstudio) {
          var model: any = {
              id: this.editEstudio.id,
              fecha: this.formEdicion.get('fecha').value.formatted,
              hora: this.formEdicion.get('hora').value.trim(),
              id_paciente: this.formEdicion.get('id_paciente').value,
              id_doctor: this.formEdicion.get('id_doctor').value,
              id_prestacion: this.formEdicion.get('id_prestacion').value,
              observaciones: this.formEdicion.get('observaciones').value.trim(),
              n_factura: this.formEdicion.get('n_factura').value.trim(),
          }
          this.loader= true;
          this.servicio.update(model)
          .subscribe(
              data => {
                  this.modalEditar.hide();
                  this.actualizarListaEdicion(data);
                  this.modificar = false;
                  this.loader= false;
                  this.toastyService.info("El estudio fue editado exitosamente");
                  this.isSubmitEstudio= false;
              },
              error => {
                  this.alert_server.messageError(error);
                  this.loader= false;
                  this.isSubmitEstudio= false;
              }
          );
      }else{
          // VALIDAR ANTES DE PUT
          this.formEdicion= this.fb.group({
              fecha: [this.formEdicion.get('fecha').value, Validators.compose([
                  Validators.required,
              ])],
              hora: [this.formEdicion.get('hora').value, Validators.compose([
                  Validators.required,
              ])],
              id_paciente: [this.formEdicion.get('id_paciente').value, Validators.compose([
                  Validators.required,
              ])],
              id_doctor: [this.formEdicion.get('id_doctor').value, Validators.compose([
                  Validators.required,
              ])],
              id_prestacion: [this.formEdicion.get('id_prestacion').value, Validators.compose([
                  Validators.required,
              ])],
              observaciones: [this.formEdicion.get('observaciones').value, Validators.compose([
                  Validators.required,
              ])],
              n_factura: [this.formEdicion.get('n_factura').value, Validators.compose([
                  Validators.required,
              ])],
          })
      }
  }

  // RECIBIR FILA DE TAREAS Y MOSTRAR EN FORMULARIO DE ELIMINACION
  onDelete(data: Estudio, index: number){
      this.deleteEstudio= data;
      this.posicionList= index;
  }

  // DELETE TAREA TEMPLATE
  delete(){
    this.loader= true;
    this.servicio.delete(this.deleteEstudio.id)
    .subscribe(
        data => {
            this.actualizarListaEliminacion();
            $('#eliminar-estudio').modal('hide');
            this.toastyService.error("El estudio fue eliminado exitosamente");
            this.loader= false;
        },
        error => {
           this.alert_server.messageError(error);
           this.loader= false;
        }
    );
  }

  // ACTUALIZAR LISTA ELIMINACION
  actualizarListaEliminacion(){
      this.listEstudios.splice(this.posicionList, 1);
  }

  // PAGO
  // ABRIR MODAL DE CREACION
  showModalPagos(estudio: Estudio, index: number):void {
    this.formPago= this.fb.group({
      monto: ['', Validators.compose([
          Validators.required,
      ])],
    })
    this.loadPagos(estudio.id);
    this.dataEstudio= estudio;
    this.modalPagos.show();
  }

  // CARGAR PAGOS
  loadPagos(id: number){
    this.idPagoOS= null;
    this.idPagoParticular= null;
    this.listPagos= null;
    this.listPagosExtras= null;
    this.servicio.getPagosEstudios(id)
    .subscribe(
      data => {
        if (data.pagos_obras_sociales.length > 0) {
          this.listPagos= data.pagos_obras_sociales;
          this.idPagoOS= data.pagos_obras_sociales[0].id;
          var total: number= 0;
          for (let sum of this.listPagos) {
            total= (total)+(parseInt(sum.pago));
          }

          this.totalOS= total;

          if (data.pagos_obras_sociales[0].pagos_extras_obras_sociales.length > 0) {
              this.listPagosExtras= data.pagos_obras_sociales[0].pagos_extras_obras_sociales;

              for (let sum of this.listPagosExtras) {
                  total= (total)+(parseInt(sum.pago));
              }
              this.totalOS= total;
          }
        }
        if (data.pagos_particulares.length > 0) {
          this.listPagos= data.pagos_particulares;
          this.idPagoParticular= data.pagos_particulares[0].id;
          var total: number= 0;
          for (let sum of this.listPagos) {
            total= (total)+(parseInt(sum.pago));
          }

          this.totalParticular= total;

          if (data.pagos_particulares[0].pagos_extras_particulares.length > 0) {
              this.listPagosExtras= data.pagos_particulares[0].pagos_extras_particulares;

              for (let sum of this.listPagosExtras) {
                  total= (total)+(parseInt(sum.pago));
              }
              this.totalParticular= total;
          }
        }
      },
      error => {
        this.alert_server.messageError(error);
      }
    );
  }

  // CERRAR MODAL DE CREACION
  hideModalPagos():void {
      this.modalPagos.hide();
      this.isSubmitPago= false;
      this.totalOS= 0;
      this.totalParticular= 0;
  }

  // AÑADIR MONTO
  addMonto(){
    this.isSubmitPago= true;
    if (this.formPago.valid && this.isSubmitPago) {
      var id_tipo: number;
      var tipo: string;
      if (this.idPagoOS) {
        id_tipo= this.idPagoOS;
        tipo= 'os';
      }
      if (this.idPagoParticular) {
        id_tipo= this.idPagoParticular;
        tipo= 'particular';
      }
      let model : any = {
        tipo: tipo,
        id_estudio: this.dataEstudio.id,
        id_tipo: id_tipo,
        monto: this.formPago.get('monto').value
      }
      this.servicio.addPago(model)
      .subscribe(
          data => {
            this.loadPagos(data.id);
            this.isSubmitPago= false;
            this.formPago.reset();
            this.toastyService.success("Se agregó el pago de manera exitosa");
          },
          error => {
            this.alert_server.messageError(error);
          }
      );
    }else{
      this.formPago= this.fb.group({
        monto: [this.formPago.get('monto').value, Validators.compose([
            Validators.required,
        ])],
      })
    }
  }

  // EDITAR MONTO DE PAGO
  editPrecio(event: any, id: number, index: number){
    if (event.target.value) {
      var id_tipo: number;
      var tipo: string;
      if (this.idPagoOS) {
        id_tipo= this.idPagoOS;
        tipo= 'os';
      }
      if (this.idPagoParticular) {
        id_tipo= this.idPagoParticular;
        tipo= 'particular';
      }
      let model:any = {
        id: id,
        id_estudio: this.dataEstudio.id,
        tipo: tipo,
        id_tipo: id_tipo,
        monto: event.target.value,
      }
      this.servicio.editPago(model)
      .subscribe(
        data => {
          this.loadPagos(data.id);
          this.toastyService.info("El pago fue editado exitosamente");
        },
        error => {
          this.alert_server.messageError(error);
        }
      );
    }else{

      $("#valorPrecio"+index).css('border-color','red');
      this.toastyService.error("Debe seleccionar un pago");

    }
  }

  // ON DELETE DE PAGOS EXTRAS
  onDeletePagosExtras(pago: any){
    this.dataPagoExtra= pago;
  }

  // BORRAR PAGO EXTRAS
  deletePagoExtra(){
    var id_tipo: number;
    var tipo: string;
    if (this.idPagoOS) {
      id_tipo= this.idPagoOS;
      tipo= 'os';
    }
    if (this.idPagoParticular) {
      id_tipo= this.idPagoParticular;
      tipo= 'particular';
    }
    let model: any= {
      id: this.dataPagoExtra.id,
      id_estudio: this.dataEstudio.id,
      tipo: tipo,
      id_tipo: id_tipo,
    }
    this.servicio.deletePago(model)
    .subscribe(
      data => {
        this.loadPagos(data.id);
        $('#eliminar-pago-extra').modal('hide');
        this.toastyService.error("El pago fue eliminado exitosamente");
      },
      error => {
        this.alert_server.messageError(error);
      }
    );
  }

}
