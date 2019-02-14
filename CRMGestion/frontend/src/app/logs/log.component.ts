import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, NgForm, FormGroup } from '@angular/forms';
import { LogService, TareaService } from '../services/index';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { ModalDirective } from 'ng2-bootstrap';
import { AlertServer } from '../global/index';
import { Log, Cliente, User, MotivoLog } from '../models/index';

@Component({
    moduleId: module.id,
    selector: 'log',
    templateUrl: './log.html',
    providers: [LogService, AlertServer]
})

export class LogComponent implements OnInit{
  listLogs: Log[]= [];
  listFiltro: any = '';
  pagina: number= -1;
  @ViewChild('modalCrear') public modalCrear:ModalDirective;
  @ViewChild('modalEditar') public modalEditar:ModalDirective;
  formCreacion: FormGroup;
  formEdicion: FormGroup;
  isSubmitLog: boolean= false;
  loader: boolean= false;
  editLog: Log;
  deleteLog: Log;
  posicionList: number;
  modificar: boolean= false;
  cmbClientes: Cliente[]= [];
  cmbUsers: User[]= [];
  cmbMotivosLogs: MotivoLog[]= [];
  cmbMotivosLogsManuales: MotivoLog[]= [];
  currentUser: any;

  // FILTROS
  fecha_filtro: string= '';
  creador_filtro: string= '';
  cliente_filtro: string= '';
  motivo_filtro: string= '';
  descripcion_filtro: string= '';
  fecha_ord: string;

  constructor(
    private servicio: LogService,
    private servicioTarea: TareaService,
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
      this.loadClientes();
      this.loadUsers();
      this.loadMotivosLogs();
      this.loadMotivosLogsManuales();
      this.loadCurrentUser();
      this.creador_filtro= this.currentUser;
  }

  // CARGA DEL COMBO CLIENTES
  loadClientes(){
      this.servicioTarea.getClientes().subscribe(
        lista => { this.cmbClientes = lista; },
        error => {
          this.alert_server.messageError(error);
        }
      );
  }

  // CARGA DEL COMBO CLIENTES
  loadUsers(){
      this.servicioTarea.getUsers().subscribe(
        lista => { this.cmbUsers = lista; },
        error => {
          this.alert_server.messageError(error);
        }
      );
  }

  // CARGA DEL COMBO CLIENTES
  loadMotivosLogs(){
      this.servicio.getMotivosLogs().subscribe(
        lista => { this.cmbMotivosLogs = lista; },
        error => {
          this.alert_server.messageError(error);
        }
      );
  }
  loadMotivosLogsManuales(){
      this.servicio.getMotivosLogsManuales().subscribe(
        lista => { this.cmbMotivosLogsManuales = lista; },
        error => {
          this.alert_server.messageError(error);
        }
      );
  }

  // USUARIO LOGUEADO
  loadCurrentUser(){
    var user= JSON.parse(localStorage.getItem('currentUser'));
    this.currentUser= user.user.id;
  }

  // CARGAR BUSQUEDA EN FILTRO
  loadSearch(){
      this.search(
        this.fecha_filtro,
        this.creador_filtro,
        this.cliente_filtro,
        this.motivo_filtro,
        this.descripcion_filtro,
        this.fecha_ord,
      )
  }

  // CARGAR FILTRO
  loadFilter(){
      this.filter(
        this.fecha_filtro,
        this.creador_filtro,
        this.cliente_filtro,
        this.motivo_filtro,
        this.descripcion_filtro,
        this.fecha_ord,
      );
  }

  // RESETEAR FILTRO A VACIO
  resetFilter(){
    this.fecha_filtro= '';
    this.creador_filtro= this.currentUser;
    this.cliente_filtro= '';
    this.motivo_filtro= '';
    this.descripcion_filtro= '';
    this.fecha_ord= '';
  }

  // APLICAR FILTRADO
  filter(fecha: string, creador: string, cliente: string, motivo: string, descripcion: string, fecha_ord: string){
      this.pagina = -1;
      this.listLogs = [];
      this.search(fecha, creador, cliente, motivo, descripcion, fecha_ord);
  }

  // FUNCIONAMIENTO DE BOTON VER MÁS
  search(fecha: string, creador: string, cliente: string, motivo: string, descripcion: string, fecha_ord: string){
      this.pagina++;
      var model: any = {
          fecha: fecha,
          creador: creador,
          cliente: cliente,
          motivo: motivo,
          descripcion: descripcion,
          fecha_ord: fecha_ord,
          pagina: this.pagina,
      }
      this.listFiltro= model;
      this.servicio.search(model).subscribe(
        (lista)=>this.cargarLista(lista),
        error => {
          this.alert_server.messageError(error);
        }
      );
  }

  cargarLista(data: Log[]){
      this.listLogs = this.listLogs.concat(data);
  }

  // LIMIAR FILTRO
  cleanFilter(){
      this.resetFilter();
  }

  // CREACION DE FORMULARIO DE CREACION
  createForm(){
      this.formCreacion= this.fb.group({
          id_cliente: ['', Validators.compose([
              Validators.required,
          ])],
          id_motivo: ['', Validators.compose([
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
      this.isSubmitLog= false;
      this.formCreacion.reset();
      this.formCreacion.patchValue({id_creador: '', id_cliente: '', id_motivo: ''});
  }

  // POST ROL DE CONTACTO
  create() {
      this.isSubmitLog= true;
      if(this.formCreacion.valid && this.isSubmitLog){
          var model: any = {
              id_cliente: this.formCreacion.get('id_cliente').value,
              id_motivo: this.formCreacion.get('id_motivo').value,
              descripcion: this.formCreacion.get('descripcion').value.trim(),
          }
          this.loader= true;
          this.servicio.create(model)
          .subscribe(
              data => {
                  this.hideModalCrear();
                  this.loadFilter();
                  this.toastyService.success("El log fue creado exitosamente");
                  this.loader= false;
                  this.isSubmitLog= false;
                  this.formCreacion.reset();
              },
              error => {
                  this.alert_server.messageError(error);
                  this.loader= false;
                  this.isSubmitLog= false;
              }
          );
      }else{
          // VALIDACION ANTES DE POST
          this.formCreacion= this.fb.group({
              id_cliente: [this.formCreacion.get('id_cliente').value, Validators.compose([
                  Validators.required,
              ])],
              id_motivo: [this.formCreacion.get('id_motivo').value, Validators.compose([
                  Validators.required,
              ])],
              descripcion: [this.formCreacion.get('descripcion').value, Validators.compose([
                  Validators.required,
              ])],
          })
      }
  }

  // RECIBIR FILA DE TAREAS Y MOSTRAR EN FORMULARIO DE EDICION
  showModalEditar(data: Log, index: number){
      this.modalEditar.show();
      this.editLog= data;
      this.posicionList= index;

      this.formEdicion= this.fb.group({
          id_cliente: [data.id_cliente, Validators.compose([
              Validators.required,
          ])],
          id_motivo: [data.id_motivo, Validators.compose([
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
          this.isSubmitLog= false;
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
      this.isSubmitLog= false;
      this.formEdicion.reset();
  }

  // ACTUALIZAR REGISTRO EN LA LISTA
  actualizarListaEdicion(data: Log[]){
      this.listLogs[this.posicionList]= data[0];
  }

  // PUT TAREAS TEMPLATES
  edit() {
      this.isSubmitLog= true;
      if(this.formEdicion.valid && this.isSubmitLog) {
          var model: any = {
              id: this.editLog.id,
              id_cliente: this.formEdicion.get('id_cliente').value,
              id_motivo: this.formEdicion.get('id_motivo').value,
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
                  this.toastyService.info("El log fue editado exitosamente");
                  this.isSubmitLog= false;
              },
              error => {
                  this.alert_server.messageError(error);
                  this.loader= false;
                  this.isSubmitLog= false;
              }
          );
      }else{
          // VALIDAR ANTES DE PUT
          this.formEdicion= this.fb.group({
              id_cliente: [this.formEdicion.get('id_cliente').value, Validators.compose([
                  Validators.required,
              ])],
              id_motivo: [this.formEdicion.get('id_motivo').value, Validators.compose([
                  Validators.required,
              ])],
              descripcion: [this.formEdicion.get('descripcion').value, Validators.compose([
                  Validators.required,
              ])],
          })
      }
  }

  // RECIBIR FILA DE TAREAS Y MOSTRAR EN FORMULARIO DE ELIMINACION
  onDelete(data: Log, index: number){
      this.deleteLog= data;
      this.posicionList= index;
  }

  // DELETE TAREA TEMPLATE
  delete(){
    this.loader= true;
    this.servicio.delete(this.deleteLog.id)
    .subscribe(
        data => {
            this.actualizarListaEliminacion();
            $('#eliminar-log').modal('hide');
            this.toastyService.error("El log fue eliminado exitosamente");
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
      this.listLogs.splice(this.posicionList, 1);
  }

}
