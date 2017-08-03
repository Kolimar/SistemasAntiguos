import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, NgForm, FormGroup } from '@angular/forms';
import { TareaTemplateService, FormaPagoService } from '../services/index';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { ModalDirective } from 'ng2-bootstrap';
import { AlertServer } from '../global/index';
import { FormaPago } from '../models/index';
import { Validaciones } from '../validaciones/index';

@Component({
    moduleId: module.id,
    selector: 'forma-pago',
    templateUrl: './forma-pago.html',
    providers: [FormaPagoService, AlertServer]
})

export class FormaPagoComponent implements OnInit{
  listFormasPago: FormaPago[]= [];
  listFiltro: any = '';
  pagina: number= -1;
  @ViewChild('modalCrear') public modalCrear:ModalDirective;
  @ViewChild('modalEditar') public modalEditar:ModalDirective;
  formCreacion: FormGroup;
  formEdicion: FormGroup;
  isSubmitFormaPago: boolean= false;
  loader: boolean= false;
  editFormaPago: FormaPago;
  deleteFormaPago: FormaPago;
  posicionList: number;
  modificar: boolean= false;

  // FILTROS
  nombre_filtro: string= '';
  descripcion_filtro: string= '';
  nombre_ord: string;

  constructor(
    private servicio: FormaPagoService,
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
          this.listFiltro.descripcion,
          this.listFiltro.nombre_ord
      );
  }

  // CARGAR FILTRO
  loadFilter(){
      this.filter(
        this.listFiltro.nombre,
        this.listFiltro.descripcion,
        this.listFiltro.nombre_ord
      );
  }

  // RESETEAR FILTRO A VACIO
  resetFilter(){
      this.nombre_filtro= '';
      this.descripcion_filtro= '';
      this.nombre_ord= '';
  }

  // APLICAR FILTRADO
  filter(nombre: string, descripcion: string, nombre_ord: string){
      this.pagina = -1;
      this.listFormasPago = [];
      this.search(nombre, descripcion, nombre_ord);
  }

  // FUNCIONAMIENTO DE BOTON VER MÁS
  search(nombre: string, descripcion: string, nombre_ord: string){
      this.pagina++;
      var model: any = {
          nombre: nombre,
          descripcion: descripcion,
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

  cargarListaTareasTemplate(data: FormaPago[]){
      this.listFormasPago = this.listFormasPago.concat(data);
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
          ])],
          descripcion: ['', Validators.compose([
              Validators.required,
              Validaciones.verificarEspacios,
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
      this.isSubmitFormaPago= false;
      this.formCreacion.reset();
  }

  // POST ROL DE CONTACTO
  create() {
      this.isSubmitFormaPago= true;
      if(this.formCreacion.valid && this.isSubmitFormaPago){
          var model: any = {
              nombre: this.formCreacion.get('nombre').value.trim(),
              descripcion: this.formCreacion.get('descripcion').value.trim(),
          }
          this.loader= true;
          this.servicio.create(model)
          .subscribe(
              data => {
                  this.hideModalCrear();
                  this.loadFilter();
                  this.toastyService.success("La forma de pago fue creada exitosamente");
                  this.loader= false;
                  this.isSubmitFormaPago= false;
                  this.formCreacion.reset();
              },
              error => {
                  this.alert_server.messageError(error);
                  this.loader= false;
                  this.isSubmitFormaPago= false;
              }
          );
      }else{
          // VALIDACION ANTES DE POST
          this.formCreacion= this.fb.group({
              nombre: [this.formCreacion.get('nombre').value, Validators.compose([
                  Validators.required,
                  Validators.maxLength(50),
              ])],
              descripcion: [this.formCreacion.get('descripcion').value, Validators.compose([
                  Validators.required,
                  Validaciones.verificarEspacios,
              ])],
          })
      }
  }

  // RECIBIR FILA DE TAREAS Y MOSTRAR EN FORMULARIO DE EDICION
  showModalEditar(formaPago: FormaPago, index: number){
      this.modalEditar.show();
      this.editFormaPago= formaPago;
      this.posicionList= index;

      this.formEdicion= this.fb.group({
          nombre: [formaPago.nombre, Validators.compose([
              Validators.required,
              Validators.maxLength(50),
          ])],
          descripcion: [formaPago.descripcion, Validators.compose([
              Validators.required,
              Validaciones.verificarEspacios,
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
          this.isSubmitFormaPago= false;
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
      this.isSubmitFormaPago= false;
      this.formEdicion.reset();
  }

  // ACTUALIZAR REGISTRO EN LA LISTA
  actualizarListaEdicion(data: FormaPago[]){
      this.listFormasPago[this.posicionList]= data[0];
  }

  // PUT TAREAS TEMPLATES
  edit() {
      this.isSubmitFormaPago= true;
      if(this.formEdicion.valid && this.isSubmitFormaPago) {
          var model: any = {
              id: this.editFormaPago.id,
              nombre: this.formEdicion.get('nombre').value.trim(),
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
                  this.toastyService.info("La forma de pago fue editada exitosamente");
                  this.isSubmitFormaPago= false;
              },
              error => {
                  this.alert_server.messageError(error);
                  this.loader= false;
                  this.isSubmitFormaPago= false;
              }
          );
      }else{
          // VALIDAR ANTES DE PUT
          this.formEdicion= this.fb.group({
              nombre: [this.formEdicion.get('nombre').value, Validators.compose([
                  Validators.required,
                  Validators.maxLength(50),
              ])],
              descripcion: [this.formEdicion.get('descripcion').value, Validators.compose([
                  Validators.required,
                  Validaciones.verificarEspacios,
              ])],
          })
      }
  }

  // RECIBIR FILA DE TAREAS Y MOSTRAR EN FORMULARIO DE ELIMINACION
  onDelete(formaPago: FormaPago, index: number){
      this.deleteFormaPago= formaPago;
      this.posicionList= index;
  }

  // DELETE TAREA TEMPLATE
  delete(){
    this.loader= true;
    this.servicio.delete(this.deleteFormaPago.id)
    .subscribe(
        data => {
            this.actualizarListaEliminacion();
            $('#eliminar-forma-pago').modal('hide');
            this.toastyService.error("La forma de pago fue eliminada exitosamente");
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
      this.listFormasPago.splice(this.posicionList, 1);
  }

}
