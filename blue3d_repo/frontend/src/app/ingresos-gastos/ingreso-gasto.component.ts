import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, NgForm, FormGroup } from '@angular/forms';
import { IngresoGastoService } from '../services/index';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { ModalDirective } from 'ngx-bootstrap';
import { AlertServer } from '../global/index';
import { IngresoGasto } from '../models/index';
import { IMyOptions } from 'mydatepicker';
import { IMyDrpOptions } from 'mydaterangepicker';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { ApiSettings } from '../global/index';

@Component({
    moduleId: module.id,
    selector: 'ingreso-gasto',
    templateUrl: './ingreso-gasto.html',
    providers: [IngresoGastoService, AlertServer]
})

export class IngresoGastoComponent implements OnInit{
  listIngresosGastos: IngresoGasto[]= [];
  listFiltro: any = '';
  pagina: number= -1;
  @ViewChild('modalCrear') public modalCrear:ModalDirective;
  @ViewChild('modalEditar') public modalEditar:ModalDirective;
  formCreacion: FormGroup;
  formEdicion: FormGroup;
  isSubmitIngresoGasto: boolean= false;
  loader: boolean= false;
  editIngresoGasto: IngresoGasto;
  deleteIngresoGasto: IngresoGasto;
  posicionList: number;
  modificar: boolean= false;
  private urlExport: any;
  public currencyMask = createNumberMask({
    prefix: '',
    suffix: '',
    thousandsSeparatorSymbol: '.'
  })
  public onlyNumberMask = createNumberMask({
    prefix: '',
    suffix: '',
    decimalSymbol: '',
    thousandsSeparatorSymbol: '',
    integerLimit: 11
  });
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
  // FILTROS
  fecha_filtro: string= '';
  motivo_filtro: string= '';
  monto_filtro: string= '';
  descripcion_filtro: string= '';
  tipo_caja_filtro: string= '';
  fecha_ord: string;

  constructor(
    private servicio: IngresoGastoService,
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
  }

  // CARGAR BUSQUEDA EN FILTRO
  loadSearch(){
      this.search(
          this.listFiltro.fecha,
          this.listFiltro.motivo,
          this.listFiltro.monto,
          this.listFiltro.descripcion,
          this.listFiltro.tipo_caja,
          this.listFiltro.fecha_ord
      );
  }

  // CARGAR FILTRO
  loadFilter(){
      this.filter(
        this.listFiltro.fecha,
        this.listFiltro.motivo,
        this.listFiltro.monto,
        this.listFiltro.descripcion,
        this.listFiltro.tipo_caja,
        this.listFiltro.fecha_ord
      );
  }

  // RESETEAR FILTRO A VACIO
  resetFilter(){
    this.fecha_filtro= '';
    this.motivo_filtro= '';
    this.monto_filtro= '';
    this.descripcion_filtro= '';
    this.tipo_caja_filtro= '';
    this.fecha_ord= '';
  }

  // APLICAR FILTRADO
  filter(fecha: string, motivo: string, monto: string, descripcion: string, tipo_caja: string, fecha_ord: string){
      this.pagina = -1;
      this.listIngresosGastos = [];
      this.search(fecha, motivo, monto, descripcion, tipo_caja, fecha_ord);
  }

  // FUNCIONAMIENTO DE BOTON VER MÁS
  search(fecha: any= '', motivo: string= '', monto: string= '', descripcion: string= '', tipo_caja: string= '', fecha_ord: string= ''){
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
          motivo: motivo,
          monto: monto,
          descripcion: descripcion,
          tipo_caja: tipo_caja,
          fecha_ord: fecha_ord,
          pagina: this.pagina,
      }
      this.listFiltro= model;
      this.servicio.search(model).subscribe((lista)=>this.cargarLista(lista));
  }

  cargarLista(data: IngresoGasto[]){
      this.listIngresosGastos = this.listIngresosGastos.concat(data);

      // URL PARA EXPORTA R A EXCEL LA ULTIMA CONSULTA
      let currentUser = JSON.parse(localStorage.getItem('currentUser'));
      var date: Date= new Date();
      this.urlExport= ApiSettings.urlApi+'export-excel-ingresos?array='+JSON.stringify(this.listIngresosGastos);
  }

  // PETCION EXCEL
  peticionExcel(){
    // $.ajax({
    //     url: ApiSettings.urlApi+'export-excel-ingresos',
    //     data: 'array='+JSON.stringify(this.listIngresosGastos),
    //     headers: { 'Authorization': 'Bearer ' + currentUser.token},
    //     type: 'GET',
    //     success: 'ok'
    // });
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
          motivo: ['', Validators.compose([
              Validators.required,
          ])],
          monto: ['', Validators.compose([
              Validators.required,
          ])],
          descripcion: ['', Validators.compose([
              Validators.required,
          ])],
          tipo_caja: ['', Validators.compose([
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
      this.isSubmitIngresoGasto= false;
      this.formCreacion.reset();
      this.formCreacion.patchValue({tipo_caja: ''})
  }

  // POST ROL DE CONTACTO
  create() {
      this.isSubmitIngresoGasto= true;
      if(this.formCreacion.valid && this.isSubmitIngresoGasto){
          var model: any = {
              fecha: this.formCreacion.get('fecha').value.formatted,
              motivo: this.formCreacion.get('motivo').value.trim(),
              monto: this.formCreacion.get('monto').value.trim(),
              descripcion: this.formCreacion.get('descripcion').value.trim(),
              tipo_caja: this.formCreacion.get('tipo_caja').value.trim(),
          }
          this.loader= true;
          this.servicio.create(model)
          .subscribe(
              data => {
                  this.hideModalCrear();
                  this.loadFilter();
                  this.toastyService.success("El ingreso de gasto fue creado exitosamente");
                  this.loader= false;
                  this.isSubmitIngresoGasto= false;
                  this.formCreacion.reset();
                  this.formCreacion.patchValue({tipo_caja: ''})
              },
              error => {
                  this.alert_server.messageError(error);
                  this.loader= false;
                  this.isSubmitIngresoGasto= false;
              }
          );
      }else{
          // VALIDACION ANTES DE POST
          this.formCreacion= this.fb.group({
              fecha: [this.formCreacion.get('fecha').value, Validators.compose([
                  Validators.required,
              ])],
              motivo: [this.formCreacion.get('motivo').value, Validators.compose([
                  Validators.required,
              ])],
              monto: [this.formCreacion.get('monto').value, Validators.compose([
                  Validators.required,
              ])],
              descripcion: [this.formCreacion.get('descripcion').value, Validators.compose([
                  Validators.required,
              ])],
              tipo_caja: [this.formCreacion.get('tipo_caja').value, Validators.compose([
                  Validators.required,
              ])],
          })
      }
  }

  // RECIBIR FILA DE TAREAS Y MOSTRAR EN FORMULARIO DE EDICION
  showModalEditar(data: IngresoGasto, index: number){
      this.modalEditar.show();
      this.editIngresoGasto= data;
      this.posicionList= index;

      // TRANSFORMAR FECHA EN OBJETO PARA MOSTRAT EN DATEPICKER
      var newFecha= new Date(data.fecha);
      var fechaObjeto = { date: { year: newFecha.getUTCFullYear(), month: newFecha.getUTCMonth() + 1, day: newFecha.getUTCDate() } };

      this.formEdicion= this.fb.group({
          fecha: [fechaObjeto, Validators.compose([
              Validators.required,
          ])],
          motivo: [data.motivo, Validators.compose([
              Validators.required,
          ])],
          monto: [data.monto, Validators.compose([
              Validators.required,
          ])],
          descripcion: [data.descripcion, Validators.compose([
              Validators.required,
          ])],
          tipo_caja: [data.tipo_caja, Validators.compose([
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
          this.isSubmitIngresoGasto= false;
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
      this.isSubmitIngresoGasto= false;
      this.formEdicion.reset();
  }

  // ACTUALIZAR REGISTRO EN LA LISTA
  actualizarListaEdicion(data: IngresoGasto[]){
      this.listIngresosGastos[this.posicionList]= data[0];
  }

  // PUT TAREAS TEMPLATES
  edit() {
      this.isSubmitIngresoGasto= true;
      if(this.formEdicion.valid && this.isSubmitIngresoGasto) {
          var model: any = {
              id: this.editIngresoGasto.id,
              fecha: this.formEdicion.get('fecha').value.formatted,
              motivo: this.formEdicion.get('motivo').value.trim(),
              monto: this.formEdicion.get('monto').value.trim(),
              descripcion: this.formEdicion.get('descripcion').value.trim(),
              tipo_caja: this.formEdicion.get('tipo_caja').value.trim(),
          }
          this.loader= true;
          this.servicio.update(model)
          .subscribe(
              data => {
                  this.modalEditar.hide();
                  this.actualizarListaEdicion(data);
                  this.modificar = false;
                  this.loader= false;
                  this.toastyService.info("El ingreso de gasto fue editado exitosamente");
                  this.isSubmitIngresoGasto= false;
              },
              error => {
                  this.alert_server.messageError(error);
                  this.loader= false;
                  this.isSubmitIngresoGasto= false;
              }
          );
      }else{
          // VALIDAR ANTES DE PUT
          this.formEdicion= this.fb.group({
              fecha: [this.formEdicion.get('fecha').value, Validators.compose([
                  Validators.required,
              ])],
              motivo: [this.formEdicion.get('motivo').value, Validators.compose([
                  Validators.required,
              ])],
              monto: [this.formEdicion.get('monto').value, Validators.compose([
                  Validators.required,
              ])],
              descripcion: [this.formEdicion.get('descripcion').value, Validators.compose([
                  Validators.required,
              ])],
              tipo_caja: [this.formEdicion.get('tipo_caja').value, Validators.compose([
                  Validators.required,
              ])],
          })
      }
  }

  // RECIBIR FILA DE TAREAS Y MOSTRAR EN FORMULARIO DE ELIMINACION
  onDelete(data: IngresoGasto, index: number){
      this.deleteIngresoGasto= data;
      this.posicionList= index;
  }

  // DELETE TAREA TEMPLATE
  delete(){
    this.loader= true;
    this.servicio.delete(this.deleteIngresoGasto.id)
    .subscribe(
        data => {
            this.actualizarListaEliminacion();
            $('#eliminar-ingreso-gasto').modal('hide');
            this.toastyService.error("El ingreso de gasto fue eliminado exitosamente");
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
      this.listIngresosGastos.splice(this.posicionList, 1);
  }


}
