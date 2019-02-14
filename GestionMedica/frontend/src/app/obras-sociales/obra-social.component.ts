import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, NgForm, FormGroup } from '@angular/forms';
import { ObraSocialService, PrestacionService } from '../services/index';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { ModalDirective } from 'ngx-bootstrap';
import { AlertServer } from '../global/index';
import { ObraSocial, Prestacion, PrecioObraSocial } from '../models/index';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

@Component({
    moduleId: module.id,
    selector: 'obra-social',
    templateUrl: './obra-social.html',
    providers: [ObraSocialService, PrestacionService, AlertServer]
})

export class ObraSocialComponent implements OnInit{
  listObrasSociales: ObraSocial[]= [];
  listFiltro: any = '';
  pagina: number= -1;
  @ViewChild('modalCrear') public modalCrear:ModalDirective;
  @ViewChild('modalEditar') public modalEditar:ModalDirective;
  @ViewChild('modalPrecio') public modalPrecio:ModalDirective;
  formCreacion: FormGroup;
  formEdicion: FormGroup;
  formPrecio: FormGroup;
  listPreciosObrasSociales: any[]= [];
  cmbPrestaciones: Prestacion[]= [];
  isSubmitObraSocial: boolean= false;
  loader: boolean= false;
  editObraSocial: ObraSocial;
  deleteObraSocial: ObraSocial;
  editPrecioObraSocial: ObraSocial;
  deletePrecioObraSocial: ObraSocial;
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
    private servicio: ObraSocialService,
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
  loadPreciosObrasSociales(id: number){
      this.servicio.getAllPreciosObrasSociales(id).subscribe(data => { this.listPreciosObrasSociales = data; });
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
      this.listObrasSociales = [];
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

  cargarLista(data: ObraSocial[]){
      this.listObrasSociales = this.listObrasSociales.concat(data);
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
      this.isSubmitObraSocial= false;
      this.formCreacion.reset();
  }

  // POST ROL DE CONTACTO
  create() {
      this.isSubmitObraSocial= true;
      if(this.formCreacion.valid && this.isSubmitObraSocial){
          var model: any = {
              nombre: this.formCreacion.get('nombre').value.trim(),
          }
          this.loader= true;
          this.servicio.create(model)
          .subscribe(
              data => {
                  this.hideModalCrear();
                  this.loadFilter();
                  this.toastyService.success("La obra social fue creada exitosamente");
                  this.loader= false;
                  this.isSubmitObraSocial= false;
                  this.formCreacion.reset();
              },
              error => {
                  this.alert_server.messageError(error);
                  this.loader= false;
                  this.isSubmitObraSocial= false;
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
  showModalEditar(data: ObraSocial, index: number){
      this.modalEditar.show();
      this.editObraSocial= data;
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
          this.isSubmitObraSocial= false;
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
      this.isSubmitObraSocial= false;
      this.formEdicion.reset();
  }

  // ACTUALIZAR REGISTRO EN LA LISTA
  actualizarListaEdicion(data: ObraSocial[]){
      this.listObrasSociales[this.posicionList]= data[0];
  }

  // PUT TAREAS TEMPLATES
  edit() {
      this.isSubmitObraSocial= true;
      if(this.formEdicion.valid && this.isSubmitObraSocial) {
          var model: any = {
              id: this.editObraSocial.id,
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
                  this.toastyService.info("La obra social fue editada exitosamente");
                  this.isSubmitObraSocial= false;
              },
              error => {
                  this.alert_server.messageError(error);
                  this.loader= false;
                  this.isSubmitObraSocial= false;
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
  onDelete(data: ObraSocial, index: number){
      this.deleteObraSocial= data;
      this.posicionList= index;
  }

  // DELETE TAREA TEMPLATE
  delete(){
    this.loader= true;
    this.servicio.delete(this.deleteObraSocial.id)
    .subscribe(
        data => {
            this.actualizarListaEliminacion();
            $('#eliminar-obra-social').modal('hide');
            this.toastyService.error("La obra social fue eliminada exitosamente");
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
      this.listObrasSociales.splice(this.posicionList, 1);
  }

  // MODULO DE PRECIOS POR PRESTACIONES
  // ABRIR MODAL DE PRECIO
  showModalPrecio(data: ObraSocial, index: number){
      this.loadPreciosObrasSociales(data.id);
      this.editPrecioObraSocial= data;
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
      this.isSubmitObraSocial= false;
      this.formPrecio.reset();
  }

  // GUARDAR PRECIO DE OBRA SOCIAL POR PRESTACIONES
  guardarPrecio(){
    this.isSubmitObraSocial= true;
    if(this.formPrecio.valid && this.isSubmitObraSocial){
        var model: any = {
            id_obra_social: this.editPrecioObraSocial.id,
            id_prestacion: this.formPrecio.get('id_prestacion').value,
            precio: this.formPrecio.get('precio').value.trim(),
        }
        this.loader= true;
        this.servicio.createPrecio(model)
        .subscribe(
            data => {
                this.loadPreciosObrasSociales(this.editPrecioObraSocial.id);
                this.toastyService.success("El precio fue agregado exitosamente");
                this.loader= false;
                this.isSubmitObraSocial= false;
                this.formPrecio.reset();
                this.formPrecio.patchValue({id_prestacion: ''});
            },
            error => {
                this.alert_server.messageError(error);
                this.loader= false;
                this.isSubmitObraSocial= false;
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
          this.loadPreciosObrasSociales(this.editPrecioObraSocial.id);
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
  onDeletePrecio(data: ObraSocial, index: number){
    this.deletePrecioObraSocial= data;
  }

  // BORRAR PRECIO
  borrarPrecioObraSocial(){
    this.loader= true;
    this.servicio.deletePrecio(this.deletePrecioObraSocial.pivot.id)
    .subscribe(
        data => {
            this.loadPreciosObrasSociales(this.editPrecioObraSocial.id);
            $('#eliminar-precio-obra-social').modal('hide');
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
