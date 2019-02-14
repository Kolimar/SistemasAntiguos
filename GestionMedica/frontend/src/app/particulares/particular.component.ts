import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, NgForm, FormGroup } from '@angular/forms';
import { ParticularService, PrestacionService } from '../services/index';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { ModalDirective } from 'ngx-bootstrap';
import { AlertServer } from '../global/index';
import { Particular, Prestacion } from '../models/index';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

@Component({
    moduleId: module.id,
    selector: 'particular',
    templateUrl: './particular.html',
    providers: [ParticularService, PrestacionService, AlertServer]
})

export class ParticularComponent implements OnInit{
  listParticulares: Particular[]= [];
  listFiltro: any = '';
  pagina: number= -1;
  @ViewChild('modalCrear') public modalCrear:ModalDirective;
  @ViewChild('modalEditar') public modalEditar:ModalDirective;
  @ViewChild('modalPrecio') public modalPrecio:ModalDirective;
  formPrecio: FormGroup;
  listPreciosParticulares: any[]= [];
  cmbPrestaciones: Prestacion[]= [];
  formCreacion: FormGroup;
  formEdicion: FormGroup;
  isSubmitParticular: boolean= false;
  loader: boolean= false;
  editParticular: Particular;
  deleteParticular: Particular;
  editPrecioParticular: Particular;
  deletePrecioParticular: Particular;
  posicionList: number;
  modificar: boolean= false;
  public currencyMask = createNumberMask({
    prefix: '',
    suffix: '',
    thousandsSeparatorSymbol: '.'
  })

  // FILTROS
  nombre_filtro: string= '';
  nombre_ord: string;

  constructor(
    private servicio: ParticularService,
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
      this.loadCmbPrestaciones();
  }

  // CARGAR LISTADO DE PRESTACIONES
  loadCmbPrestaciones(){
      this.servicioPrestacion.getCmbPrestaciones().subscribe(data => { this.cmbPrestaciones = data; });
  }

  // CARGAR PRECIOS POR OBRAS SOCIALES
  loadPreciosParticulares(id: number){
      this.servicio.getAllPreciosParticulares(id).subscribe(data => { this.listPreciosParticulares = data; });
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
      this.listParticulares = [];
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
      this.servicio.search(model).subscribe((lista)=>this.cargarLista(lista));
  }

  cargarLista(data: Particular[]){
      this.listParticulares = this.listParticulares.concat(data);
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
      this.isSubmitParticular= false;
      this.formCreacion.reset();
  }

  // POST ROL DE CONTACTO
  create() {
      this.isSubmitParticular= true;
      if(this.formCreacion.valid && this.isSubmitParticular){
          var model: any = {
              nombre: this.formCreacion.get('nombre').value.trim(),
          }
          this.loader= true;
          this.servicio.create(model)
          .subscribe(
              data => {
                  this.hideModalCrear();
                  this.loadFilter();
                  this.toastyService.success("Particular fue creado exitosamente");
                  this.loader= false;
                  this.isSubmitParticular= false;
                  this.formCreacion.reset();
              },
              error => {
                  this.alert_server.messageError(error);
                  this.loader= false;
                  this.isSubmitParticular= false;
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
  showModalEditar(data: Particular, index: number){
      this.modalEditar.show();
      this.editParticular= data;
      this.posicionList= index;

      this.formEdicion= this.fb.group({
          nombre: [data.nombre, Validators.compose([
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
          this.isSubmitParticular= false;
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
      this.isSubmitParticular= false;
      this.formEdicion.reset();
  }

  // ACTUALIZAR REGISTRO EN LA LISTA
  actualizarListaEdicion(data: Particular[]){
      this.listParticulares[this.posicionList]= data[0];
  }

  // PUT TAREAS TEMPLATES
  edit() {
      this.isSubmitParticular= true;
      if(this.formEdicion.valid && this.isSubmitParticular) {
          var model: any = {
              id: this.editParticular.id,
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
                  this.toastyService.info("Particular fue editado exitosamente");
                  this.isSubmitParticular= false;
              },
              error => {
                  this.alert_server.messageError(error);
                  this.loader= false;
                  this.isSubmitParticular= false;
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
  onDelete(data: Particular, index: number){
      this.deleteParticular= data;
      this.posicionList= index;
  }

  // DELETE TAREA TEMPLATE
  delete(){
    this.loader= true;
    this.servicio.delete(this.deleteParticular.id)
    .subscribe(
        data => {
            this.actualizarListaEliminacion();
            $('#eliminar-particular').modal('hide');
            this.toastyService.error("Particular fue eliminado exitosamente");
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
      this.listParticulares.splice(this.posicionList, 1);
  }

  // MODULO DE PRECIOS POR PRESTACIONES
  // ABRIR MODAL DE PRECIO
  showModalPrecio(data: Particular, index: number){
      this.loadPreciosParticulares(data.id);
      this.editPrecioParticular= data;
      this.formPrecio= this.fb.group({
          id_prestacion: ['', Validators.compose([
              Validators.required,
          ])],
          precio: ['', Validators.compose([
              Validators.required,
          ])],
      })
      this.modalPrecio.show();
  }

  // CERRAR MODAL DE PRECIO
  hideModalPrecio(){
      this.modalPrecio.hide();
      this.isSubmitParticular= false;
      this.formPrecio.reset();
  }

  // GUARDAR PRECIO DE OBRA SOCIAL POR PRESTACIONES
  guardarPrecio(){
    this.isSubmitParticular= true;
    if(this.formPrecio.valid && this.isSubmitParticular){
        var model: any = {
            id_particular: this.editPrecioParticular.id,
            id_prestacion: this.formPrecio.get('id_prestacion').value,
            precio: this.formPrecio.get('precio').value.trim(),
        }
        this.loader= true;
        this.servicio.createPrecio(model)
        .subscribe(
            data => {
                this.loadPreciosParticulares(this.editPrecioParticular.id);
                this.toastyService.success("El precio fue agregado exitosamente");
                this.loader= false;
                this.isSubmitParticular= false;
                this.formPrecio.reset();
                this.formPrecio.patchValue({id_prestacion: ''});
            },
            error => {
                this.alert_server.messageError(error);
                this.loader= false;
                this.isSubmitParticular= false;
            }
        );
    }else{
        // VALIDACION ANTES DE POST
        this.formPrecio= this.fb.group({
            id_prestacion: [this.formPrecio.get('id_prestacion').value, Validators.compose([
                Validators.required,
            ])],
            precio: [this.formPrecio.get('precio').value, Validators.compose([
                Validators.required,
            ])],
        })
    }
  }

  // EDITAR PRECIO DE OBRA SOCIALES
  editPrecio(event: any, id: number, index: number){
    if (event.target.value) {
      let model:any = {
        id: id,
        precio: event.target.value,
      }
      this.servicio.editPrecio(model)
      .subscribe(
        data => {
          this.loadPreciosParticulares(this.editPrecioParticular.id);
          this.toastyService.info("El precio fue editado exitosamente");
        },
        error => {
          this.alert_server.messageError(error);
        }
      );

    }else{

      $("#valorPrecio"+index).css('border-color','red');
      this.toastyService.error("La prestación debe tener un precio");

    }
  }

  //MODAL DE ELIMINACION DE PRECIO POR OBRA SOCIALES
  onDeletePrecio(data: Particular, index: number){
    this.deletePrecioParticular= data;
  }

  // BORRAR PRECIO
  borrarPrecioParticular(){
    this.loader= true;
    this.servicio.deletePrecio(this.deletePrecioParticular.pivot.id)
    .subscribe(
        data => {
            this.loadPreciosParticulares(this.editPrecioParticular.id);
            $('#eliminar-precio-particular').modal('hide');
            this.toastyService.error("El precio fue eliminado exitosamente");
            this.loader= false;
        },
        error => {
           this.alert_server.messageError(error);
           this.loader= false;
        }
    );
  }

}
