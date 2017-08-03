import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, NgForm, FormGroup } from '@angular/forms';
import { TareaTemplateService, MotivoLogService } from '../services/index';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { ModalDirective } from 'ng2-bootstrap';
import { AlertServer } from '../global/index';
import { MotivoLog } from '../models/index';
import { Validaciones } from '../validaciones/index';

@Component({
    moduleId: module.id,
    selector: 'motivo-log',
    templateUrl: './motivo-log.html',
    providers: [MotivoLogService, AlertServer]
})

export class MotivoLogComponent implements OnInit{
  listMotivosLogs: MotivoLog[]= [];
  listFiltro: any = '';
  pagina: number= -1;
  @ViewChild('modalCrear') public modalCrear:ModalDirective;
  @ViewChild('modalEditar') public modalEditar:ModalDirective;
  formCreacion: FormGroup;
  formEdicion: FormGroup;
  isSubmitMotivoLog: boolean= false;
  loader: boolean= false;
  editMotivoLog: MotivoLog;
  deleteMotivoLog: MotivoLog;
  posicionList: number;
  modificar: boolean= false;

  // FILTROS
  nombre_filtro: string= '';
  milestone_filtro: string= '';
  interes_filtro: string= '';
  nombre_ord: string;

  constructor(
    private servicio: MotivoLogService,
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
          this.listFiltro.nombre,
          this.listFiltro.milestone,
          this.listFiltro.interes,
          this.listFiltro.nombre_ord
      );
  }

  // CARGAR FILTRO
  loadFilter(){
      this.filter(
        this.listFiltro.nombre,
        this.listFiltro.milestone,
        this.listFiltro.interes,
        this.listFiltro.nombre_ord
      );
  }

  // RESETEAR FILTRO A VACIO
  resetFilter(){
      this.nombre_filtro= '';
      this.milestone_filtro= '';
      this.interes_filtro= '';
      this.nombre_ord= '';
  }

  // APLICAR FILTRADO
  filter(nombre: string, milestone: string, interes: string, nombre_ord: string){
      this.pagina = -1;
      this.listMotivosLogs = [];
      this.search(nombre, milestone, interes, nombre_ord);
  }

  // FUNCIONAMIENTO DE BOTON VER MÁS
  search(nombre: string, milestone: string, interes: string, nombre_ord: string){
      this.pagina++;
      var model: any = {
          nombre: nombre,
          milestone: milestone,
          interes: interes,
          nombre_ord: nombre_ord,
          pagina: this.pagina,
      }
      this.listFiltro= model;
      this.servicio.search(model).subscribe(
        (lista)=>this.cargarListaTareasTemplate(lista),
        error => {
          this.alert_server.messageError(error);
        }
      );
  }

  cargarListaTareasTemplate(data: MotivoLog[]){
      this.listMotivosLogs = this.listMotivosLogs.concat(data);
  }

  // LIMIAR FILTRO
  cleanFilter(){
      this.resetFilter();
  }

  // CREACION DE FORMULARIO DE CREACION
  createForm(){
      this.formCreacion= this.fb.group({
          nombre: ['', Validators.compose([
              Validators.required,
              Validators.maxLength(50),
          ])],
          es_milestone: ['', Validators.compose([
              Validators.required,
          ])],
          interes_gerencial: ['', Validators.compose([
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
      this.isSubmitMotivoLog= false;
      this.formCreacion.reset();
      this.formCreacion.patchValue({es_milestone: '', interes_gerencial: ''});
  }

  // POST ROL DE CONTACTO
  create() {
      this.isSubmitMotivoLog= true;
      if(this.formCreacion.valid && this.isSubmitMotivoLog){
          var model: any = {
              nombre: this.formCreacion.get('nombre').value.trim(),
              es_milestone: this.formCreacion.get('es_milestone').value,
              interes_gerencial: this.formCreacion.get('interes_gerencial').value,
          }
          this.loader= true;
          this.servicio.create(model)
          .subscribe(
              data => {
                  this.hideModalCrear();
                  this.loadFilter();
                  this.toastyService.success("El motivo de log fue creado exitosamente");
                  this.loader= false;
                  this.isSubmitMotivoLog= false;
                  this.formCreacion.reset();
              },
              error => {
                  this.alert_server.messageError(error);
                  this.loader= false;
                  this.isSubmitMotivoLog= false;
              }
          );
      }else{
          // VALIDACION ANTES DE POST
          this.formCreacion= this.fb.group({
              nombre: [this.formCreacion.get('nombre').value, Validators.compose([
                  Validators.required,
                  Validators.maxLength(50),
              ])],
              es_milestone: [this.formCreacion.get('es_milestone').value, Validators.compose([
                  Validators.required,
              ])],
              interes_gerencial: [this.formCreacion.get('interes_gerencial').value, Validators.compose([
                  Validators.required,
              ])],
          })
      }
  }

  // RECIBIR FILA DE TAREAS Y MOSTRAR EN FORMULARIO DE EDICION
  showModalEditar(motivoLog: MotivoLog, index: number){
      this.modalEditar.show();
      this.editMotivoLog= motivoLog;
      this.posicionList= index;

      this.formEdicion= this.fb.group({
          nombre: [motivoLog.nombre, Validators.compose([
              Validators.required,
              Validators.maxLength(50),
          ])],
          es_milestone: [motivoLog.es_milestone, Validators.compose([
              Validators.required,
          ])],
          interes_gerencial: [motivoLog.interes_gerencial, Validators.compose([
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
          this.isSubmitMotivoLog= false;
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
      this.isSubmitMotivoLog= false;
      this.formEdicion.reset();
  }

  // ACTUALIZAR REGISTRO EN LA LISTA
  actualizarListaEdicion(data: MotivoLog[]){
      this.listMotivosLogs[this.posicionList]= data[0];
  }

  // PUT TAREAS TEMPLATES
  edit() {
      this.isSubmitMotivoLog= true;
      if(this.formEdicion.valid && this.isSubmitMotivoLog) {
          var model: any = {
              id: this.editMotivoLog.id,
              nombre: this.formEdicion.get('nombre').value.trim(),
              es_milestone: this.formEdicion.get('es_milestone').value,
              interes_gerencial: this.formEdicion.get('interes_gerencial').value,
          }
          this.loader= true;
          this.servicio.update(model)
          .subscribe(
              data => {
                  this.modalEditar.hide();
                  this.actualizarListaEdicion(data);
                  this.modificar = false;
                  this.loader= false;
                  this.toastyService.info("El motivo de log fue editado exitosamente");
                  this.isSubmitMotivoLog= false;
              },
              error => {
                  this.alert_server.messageError(error);
                  this.loader= false;
                  this.isSubmitMotivoLog= false;
              }
          );
      }else{
          // VALIDAR ANTES DE PUT
          this.formEdicion= this.fb.group({
              nombre: [this.formEdicion.get('nombre').value, Validators.compose([
                  Validators.required,
                  Validators.maxLength(50),
              ])],
              es_milestone: [this.formEdicion.get('es_milestone').value, Validators.compose([
                  Validators.required,
              ])],
              interes_gerencial: [this.formEdicion.get('interes_gerencial').value, Validators.compose([
                  Validators.required,
              ])],
          })
      }
  }

  // RECIBIR FILA DE TAREAS Y MOSTRAR EN FORMULARIO DE ELIMINACION
  onDelete(motivoLog: MotivoLog, index: number){
      this.deleteMotivoLog= motivoLog;
      this.posicionList= index;
  }

  // DELETE TAREA TEMPLATE
  delete(){
    this.loader= true;
    this.servicio.delete(this.deleteMotivoLog.id)
    .subscribe(
        data => {
            this.actualizarListaEliminacion();
            $('#eliminar-motivo-log').modal('hide');
            this.toastyService.error("El motivo de log fue eliminado exitosamente");
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
      this.listMotivosLogs.splice(this.posicionList, 1);
  }

}
