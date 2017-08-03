import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, Validators, NgForm, FormGroup } from '@angular/forms';
import { VisitaService } from '../../services/index';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { ModalDirective } from 'ngx-bootstrap';
import { AlertServer } from '../../global/index';
import { Visita } from '../../models/index';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { IMyOptions } from 'mydatepicker';

@Component({
    moduleId: module.id,
    selector: 'visita',
    templateUrl: './visita.html',
    providers: [VisitaService, AlertServer]
})

export class VisitaComponent implements OnInit{
  listVisitas: Visita[]= [];
  listFiltro: any = '';
  pagina: number= -1;
  @ViewChild('modalCrear') public modalCrear:ModalDirective;
  @ViewChild('modalEditar') public modalEditar:ModalDirective;
  formCreacion: FormGroup;
  formEdicion: FormGroup;
  isSubmitVisita: boolean= false;
  loader: boolean= false;
  editVisita: Visita;
  deleteVisita: Visita;
  posicionList: number;
  modificar: boolean= false;
  selectedId: number;
  selectedName: string;
  selectedLastname: string;
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

  // FILTROS
  fecha_filtro: string= '';
  fecha_ord: string;
  descripcion_filtro: string = '';

  constructor(
    private servicio: VisitaService,
    private router: Router,
    private route: ActivatedRoute,
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
          this.listFiltro.fecha_ord,
          this.listFiltro.descripcion,
      );
  }

  // CARGAR FILTRO
  loadFilter(){
      this.filter(
        this.listFiltro.fecha,
        this.listFiltro.fecha_ord,
        this.listFiltro.descripcion,
      );
  }

  // RESETEAR FILTRO A VACIO
  resetFilter(){
      this.fecha_filtro= '';
      this.fecha_ord= '';
      this.descripcion_filtro= '';
  }

  // APLICAR FILTRADO
  filter(fecha: string, fecha_ord: string, descripcion: string){
      this.pagina = -1;
      this.listVisitas = [];
      this.search(fecha, fecha_ord, descripcion);
  }

  // FUNCIONAMIENTO DE BOTON VER MÁS
  search(fecha: string, fecha_ord: string, descripcion: string){
      this.pagina++;
      var model: any = {
          fecha: fecha,
          fecha_ord: fecha_ord,
          descripcion: descripcion,
          pagina: this.pagina,
      }
      this.listFiltro= model;
      this.route.params
            .switchMap((params: Params) => {
            this.selectedId = +params['id'];
            this.selectedName = params['name'];
            this.selectedLastname = params['lastname'];
            return this.servicio.search(model, this.selectedId)
        })
        .subscribe((lista)=>this.cargarLista(lista));
  }

  cargarLista(data: Visita[]){
      this.listVisitas = this.listVisitas.concat(data);
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
          descripcion: ['', Validators.compose([
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
      this.isSubmitVisita= false;
      this.formCreacion.reset();
  }

  // POST ROL DE CONTACTO
  create() {
      this.isSubmitVisita= true;
      if(this.formCreacion.valid && this.isSubmitVisita){
          var model: any = {
              id_doctor: this.selectedId,
              fecha: this.formCreacion.get('fecha').value.formatted,
              descripcion: this.formCreacion.get('descripcion').value.trim(),
          }
          this.loader= true;
          this.servicio.create(model)
          .subscribe(
              data => {
                  this.hideModalCrear();
                  this.loadFilter();
                  this.toastyService.success("La visita fue creada exitosamente");
                  this.loader= false;
                  this.isSubmitVisita= false;
                  this.formCreacion.reset();
              },
              error => {
                  this.alert_server.messageError(error);
                  this.loader= false;
                  this.isSubmitVisita= false;
              }
          );
      }else{
          // VALIDACION ANTES DE POST
          this.formCreacion= this.fb.group({
              fecha: [this.formCreacion.get('fecha').value, Validators.compose([
                  Validators.required,
              ])],
              descripcion: [this.formCreacion.get('descripcion').value, Validators.compose([
                  Validators.required,
              ])],
          })
      }
  }

  // RECIBIR FILA DE TAREAS Y MOSTRAR EN FORMULARIO DE EDICION
  showModalEditar(data: Visita, index: number){
      this.modalEditar.show();
      this.editVisita= data;
      this.posicionList= index;

      // TRANSFORMAR FECHA EN OBJETO PARA MOSTRAT EN DATEPICKER
      var newFecha= new Date(data.fecha);
      var fechaObjeto = { date: { year: newFecha.getUTCFullYear(), month: newFecha.getUTCMonth() + 1, day: newFecha.getUTCDate() } };

      this.formEdicion= this.fb.group({
          fecha: [fechaObjeto, Validators.compose([
              Validators.required,
          ])],
          descripcion: [data.descripcion, Validators.compose([
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
          this.isSubmitVisita= false;
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
      this.isSubmitVisita= false;
      this.formEdicion.reset();
  }

  // ACTUALIZAR REGISTRO EN LA LISTA
  actualizarListaEdicion(data: Visita[]){
      this.listVisitas[this.posicionList]= data[0];
  }

  // PUT TAREAS TEMPLATES
  edit() {
      this.isSubmitVisita= true;
      if(this.formEdicion.valid && this.isSubmitVisita) {
          var model: any = {
              id: this.editVisita.id,
              fecha: this.formEdicion.get('fecha').value.formatted,
              descripcion: this.formEdicion.get('descripcion').value.trim(),
          }
          this.loader= true;
          this.servicio.update(model)
          .subscribe(
              data => {
                  this.modalEditar.hide();
                  this.actualizarListaEdicion(data);
                  this.modificar = false;
                  this.loader= false;
                  this.toastyService.info("La visita fue editada exitosamente");
                  this.isSubmitVisita= false;
              },
              error => {
                  this.alert_server.messageError(error);
                  this.loader= false;
                  this.isSubmitVisita= false;
              }
          );
      }else{
          // VALIDAR ANTES DE PUT
          this.formEdicion= this.fb.group({
              fecha: [this.formEdicion.get('fecha').value, Validators.compose([
                  Validators.required,
              ])],
              descripcion: [this.formEdicion.get('descripcion').value, Validators.compose([
                  Validators.required,
              ])],
          })
      }
  }

  // RECIBIR FILA DE TAREAS Y MOSTRAR EN FORMULARIO DE ELIMINACION
  onDelete(data: Visita, index: number){
      this.deleteVisita= data;
      this.posicionList= index;
  }

  // DELETE TAREA TEMPLATE
  delete(){
    this.loader= true;
    this.servicio.delete(this.deleteVisita.id)
    .subscribe(
        data => {
            this.actualizarListaEliminacion();
            $('#eliminar-visita').modal('hide');
            this.toastyService.error("La visita fue eliminada exitosamente");
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
      this.listVisitas.splice(this.posicionList, 1);
  }

}
