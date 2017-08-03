import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, NgForm, FormGroup } from '@angular/forms';
import { TareaTemplateService, TipoTareaService } from '../services/index';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { ModalDirective } from 'ng2-bootstrap';
import { AlertServer } from '../global/index';
import { TipoTarea } from '../models/index';

@Component({
    moduleId: module.id,
    selector: 'tipo-tarea',
    templateUrl: './tipo-tarea.html',
    providers: [TipoTareaService, AlertServer]
})

export class TipoTareaComponent implements OnInit{
  listTiposTareas: TipoTarea[]= [];
  listFiltro: any = '';
  pagina: number= -1;
  @ViewChild('modalCrear') public modalCrear:ModalDirective;
  @ViewChild('modalEditar') public modalEditar:ModalDirective;
  formCreacion: FormGroup;
  formEdicion: FormGroup;
  isSubmitTipoTarea: boolean= false;
  loader: boolean= false;
  editTipoTarea: TipoTarea;
  deleteTipoTarea: TipoTarea;
  posicionList: number;
  modificar: boolean= false;

  // FILTROS
  nombre_filtro: string= '';
  nombre_ord: string;

  constructor(
    private servicio: TipoTareaService,
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
          this.listFiltro.nombre_ord
      );
  }

  // CARGAR FILTRO
  loadFilter(){
      this.filter(
        this.listFiltro.nombre,
        this.listFiltro.nombre_ord
      );
  }

  // RESETEAR FILTRO A VACIO
  resetFilter(){
      this.nombre_filtro= '';
      this.nombre_ord= '';
  }

  // APLICAR FILTRADO
  filter(nombre: string, nombre_ord: string){
      this.pagina = -1;
      this.listTiposTareas = [];
      this.search(nombre, nombre_ord);
  }

  // FUNCIONAMIENTO DE BOTON VER MÁS
  search(nombre: string, nombre_ord: string){
      this.pagina++;
      var model: any = {
          nombre: nombre,
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

  cargarListaTareasTemplate(data: TipoTarea[]){
      this.listTiposTareas = this.listTiposTareas.concat(data);
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
      })
  }

  // ABRIR MODAL DE CREACION
  showModalCrear():void {
      this.modalCrear.show();
  }

  // CERRAR MODAL DE CREACION
  hideModalCrear():void {
      this.modalCrear.hide();
      this.isSubmitTipoTarea= false;
      this.formCreacion.reset();
  }

  // POST ROL DE CONTACTO
  create() {
      this.isSubmitTipoTarea= true;
      if(this.formCreacion.valid && this.isSubmitTipoTarea){
          var model: any = {
              nombre: this.formCreacion.get('nombre').value.trim(),
          }
          this.loader= true;
          this.servicio.create(model)
          .subscribe(
              data => {
                  this.hideModalCrear();
                  this.loadFilter();
                  this.toastyService.success("El tipo de tarea fue creado exitosamente");
                  this.loader= false;
                  this.isSubmitTipoTarea= false;
                  this.formCreacion.reset();
              },
              error => {
                  this.alert_server.messageError(error);
                  this.loader= false;
                  this.isSubmitTipoTarea= false;
              }
          );
      }else{
          // VALIDACION ANTES DE POST
          this.formCreacion= this.fb.group({
              nombre: [this.formCreacion.get('nombre').value, Validators.compose([
                  Validators.required,
                  Validators.maxLength(50),
              ])],
          })
      }
  }

  // RECIBIR FILA DE TAREAS Y MOSTRAR EN FORMULARIO DE EDICION
  showModalEditar(tipoTarea: TipoTarea, index: number){
      this.modalEditar.show();
      this.editTipoTarea= tipoTarea;
      this.posicionList= index;

      this.formEdicion= this.fb.group({
          nombre: [tipoTarea.nombre, Validators.compose([
              Validators.required,
              Validators.maxLength(50),
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
          this.isSubmitTipoTarea= false;
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
      this.isSubmitTipoTarea= false;
      this.formEdicion.reset();
  }

  // ACTUALIZAR REGISTRO EN LA LISTA
  actualizarListaEdicion(data: TipoTarea[]){
      this.listTiposTareas[this.posicionList]= data[0];
  }

  // PUT TAREAS TEMPLATES
  edit() {
      this.isSubmitTipoTarea= true;
      if(this.formEdicion.valid && this.isSubmitTipoTarea) {
          var model: any = {
              id: this.editTipoTarea.id,
              nombre: this.formEdicion.get('nombre').value.trim(),
          }
          this.loader= true;
          this.servicio.update(model)
          .subscribe(
              data => {
                  this.modalEditar.hide();
                  this.actualizarListaEdicion(data);
                  this.modificar = false;
                  this.loader= false;
                  this.toastyService.info("El tipo de tarea fue editado exitosamente");
                  this.isSubmitTipoTarea= false;
              },
              error => {
                  this.alert_server.messageError(error);
                  this.loader= false;
                  this.isSubmitTipoTarea= false;
              }
          );
      }else{
          // VALIDAR ANTES DE PUT
          this.formEdicion= this.fb.group({
              nombre: [this.formEdicion.get('nombre').value, Validators.compose([
                  Validators.required,
                  Validators.maxLength(50),
              ])],
          })
      }
  }

  // RECIBIR FILA DE TAREAS Y MOSTRAR EN FORMULARIO DE ELIMINACION
  onDelete(tipoTarea: TipoTarea, index: number){
      this.deleteTipoTarea= tipoTarea;
      this.posicionList= index;
  }

  // DELETE TAREA TEMPLATE
  delete(){
    this.loader= true;
    this.servicio.delete(this.deleteTipoTarea.id)
    .subscribe(
        data => {
            this.actualizarListaEliminacion();
            $('#eliminar-tipo-tarea').modal('hide');
            this.toastyService.error("El tipo de tarea fue eliminado exitosamente");
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
      this.listTiposTareas.splice(this.posicionList, 1);
  }

}
