import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, NgForm, FormGroup } from '@angular/forms';
import { DoctorService } from '../services/index';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { ModalDirective } from 'ngx-bootstrap';
import { AlertServer } from '../global/index';
import { Doctor } from '../models/index';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

@Component({
    moduleId: module.id,
    selector: 'doctor',
    templateUrl: './doctor.html',
    providers: [DoctorService, AlertServer]
})

export class DoctorComponent implements OnInit{
  listDoctores: Doctor[]= [];
  listFiltro: any = '';
  pagina: number= -1;
  @ViewChild('modalCrear') public modalCrear:ModalDirective;
  @ViewChild('modalEditar') public modalEditar:ModalDirective;
  formCreacion: FormGroup;
  formEdicion: FormGroup;
  isSubmitDoctor: boolean= false;
  loader: boolean= false;
  editDoctor: Doctor;
  deleteDoctor: Doctor;
  posicionList: number;
  modificar: boolean= false;
  public onlyNumberMask = createNumberMask({
    prefix: '',
    suffix: '',
    decimalSymbol: '',
    thousandsSeparatorSymbol: '',
    integerLimit: 11
  });

  // FILTROS
  matricula_filtro: string= '';
  nombres_filtro: string= '';
  apellidos_filtro: string= '';
  especialidad_filtro: string= '';
  domicilio_filtro: string= '';
  departamento_filtro: string= '';
  telefono_filtro: string= '';
  celular_filtro: string= '';
  email_filtro: string= '';
  observaciones_filtro: string= '';
  nombres_ord: string;

  constructor(
    private servicio: DoctorService,
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
          this.listFiltro.matricula,
          this.listFiltro.nombres,
          this.listFiltro.apellidos,
          this.listFiltro.especialidad,
          this.listFiltro.domicilio,
          this.listFiltro.departamento,
          this.listFiltro.telefono,
          this.listFiltro.celular,
          this.listFiltro.email,
          this.listFiltro.observaciones,
          this.listFiltro.nombres_ord
      );
  }

  // CARGAR FILTRO
  loadFilter(){
      this.filter(
        this.listFiltro.matricula,
        this.listFiltro.nombres,
        this.listFiltro.apellidos,
        this.listFiltro.especialidad,
        this.listFiltro.domicilio,
        this.listFiltro.departamento,
        this.listFiltro.telefono,
        this.listFiltro.celular,
        this.listFiltro.email,
        this.listFiltro.observaciones,
        this.listFiltro.nombres_ord
      );
  }

  // RESETEAR FILTRO A VACIO
  resetFilter(){
    this.matricula_filtro= '';
    this.nombres_filtro= '';
    this.apellidos_filtro= '';
    this.especialidad_filtro= '';
    this.domicilio_filtro= '';
    this.departamento_filtro= '';
    this.telefono_filtro= '';
    this.celular_filtro= '';
    this.email_filtro= '';
    this.listFiltro.observaciones= '';
    this.nombres_ord= '';
  }

  // APLICAR FILTRADO
  filter(matricula: string, nombres: string, apellidos: string, especialidad: string, domicilio: string, departamento: string, telefono: string, celular: string, email: string, observaciones: string, nombres_ord: string){
      this.pagina = -1;
      this.listDoctores = [];
      this.search(matricula, nombres, apellidos, especialidad, domicilio, departamento, telefono, celular, email, observaciones, nombres_ord);
  }

  // FUNCIONAMIENTO DE BOTON VER MÁS
  search(matricula: string, nombres: string, apellidos: string, especialidad: string, domicilio: string, departamento: string, telefono: string, celular: string, email: string, observaciones: string, nombres_ord: string){
      this.pagina++;
      var model: any = {
          matricula: matricula,
          nombres: nombres,
          apellidos: apellidos,
          especialidad: especialidad,
          domicilio: domicilio,
          departamento: departamento,
          telefono: telefono,
          celular: celular,
          email: email,
          observaciones: observaciones,
          nombres_ord: nombres_ord,
          pagina: this.pagina,
      }
      this.listFiltro= model;
      this.servicio.search(model).subscribe((lista)=>this.cargarLista(lista));
  }

  cargarLista(data: Doctor[]){
      this.listDoctores = this.listDoctores.concat(data);
  }

  // LIMIAR FILTRO
  cleanFilter(){
      this.resetFilter();
  }

  // CREACION DE FORMULARIO DE CREACION
  createForm(){
      this.formCreacion= this.fb.group({
          matricula: ['', Validators.compose([
              Validators.required,
          ])],
          nombres: ['', Validators.compose([
              Validators.required,
          ])],
          apellidos: ['', Validators.compose([
              Validators.required,
          ])],
          especialidad: ['', Validators.compose([
              Validators.required,
          ])],
          domicilio: ['', Validators.compose([
              Validators.required,
          ])],
          n_departamento: '',
          telefono: ['', Validators.compose([
              Validators.required,
          ])],
          celular: ['', Validators.compose([
              Validators.required,
          ])],
          email: ['', Validators.compose([
              Validators.required,
              Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i)
          ])],
          observaciones: ['', Validators.compose([
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
      this.isSubmitDoctor= false;
      this.formCreacion.reset();
  }

  // POST ROL DE CONTACTO
  create() {
      this.isSubmitDoctor= true;
      if(this.formCreacion.valid && this.isSubmitDoctor){
          var model: any = {
              matricula: this.formCreacion.get('matricula').value.trim(),
              nombres: this.formCreacion.get('nombres').value.trim(),
              apellidos: this.formCreacion.get('apellidos').value.trim(),
              especialidad: this.formCreacion.get('especialidad').value.trim(),
              domicilio: this.formCreacion.get('domicilio').value.trim(),
              n_departamento: this.formCreacion.get('n_departamento').value,
              telefono: this.formCreacion.get('telefono').value.trim(),
              celular: this.formCreacion.get('celular').value.trim(),
              email: this.formCreacion.get('email').value.trim(),
              observaciones: this.formCreacion.get('observaciones').value.trim(),
          }
          this.loader= true;
          this.servicio.create(model)
          .subscribe(
              data => {
                  this.hideModalCrear();
                  this.loadFilter();
                  this.toastyService.success("El doctor fue creado exitosamente");
                  this.loader= false;
                  this.isSubmitDoctor= false;
                  this.formCreacion.reset();
              },
              error => {
                  this.alert_server.messageError(error);
                  this.loader= false;
                  this.isSubmitDoctor= false;
              }
          );
      }else{
          // VALIDACION ANTES DE POST
          this.formCreacion= this.fb.group({
              matricula: [this.formCreacion.get('matricula').value, Validators.compose([
                  Validators.required,
              ])],
              nombres: [this.formCreacion.get('nombres').value, Validators.compose([
                  Validators.required,
              ])],
              apellidos: [this.formCreacion.get('apellidos').value, Validators.compose([
                  Validators.required,
              ])],
              especialidad: [this.formCreacion.get('especialidad').value, Validators.compose([
                  Validators.required,
              ])],
              domicilio: [this.formCreacion.get('domicilio').value, Validators.compose([
                  Validators.required,
              ])],
              n_departamento: this.formCreacion.get('n_departamento').value,
              telefono: [this.formCreacion.get('telefono').value, Validators.compose([
                  Validators.required,
              ])],
              celular: [this.formCreacion.get('celular').value, Validators.compose([
                  Validators.required,
              ])],
              email: [this.formCreacion.get('email').value, Validators.compose([
                  Validators.required,
                  Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i)
              ])],
              observaciones: [this.formCreacion.get('observaciones').value, Validators.compose([
                  Validators.required,
              ])],
          })
      }
  }

  // RECIBIR FILA DE TAREAS Y MOSTRAR EN FORMULARIO DE EDICION
  showModalEditar(data: Doctor, index: number){
      this.modalEditar.show();
      this.editDoctor= data;
      this.posicionList= index;

      this.formEdicion= this.fb.group({
          matricula: [data.matricula, Validators.compose([
              Validators.required,
          ])],
          nombres: [data.nombres, Validators.compose([
              Validators.required,
          ])],
          apellidos: [data.apellidos, Validators.compose([
              Validators.required,
          ])],
          especialidad: [data.especialidad, Validators.compose([
              Validators.required,
          ])],
          domicilio: [data.domicilio, Validators.compose([
              Validators.required,
          ])],
          n_departamento: data.n_departamento,
          telefono: [data.telefono, Validators.compose([
              Validators.required,
          ])],
          celular: [data.celular, Validators.compose([
              Validators.required,
          ])],
          email: [data.email, Validators.compose([
              Validators.required,
              Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i)
          ])],
          observaciones: [data.observaciones, Validators.compose([
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
          this.isSubmitDoctor= false;
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
      this.isSubmitDoctor= false;
      this.formEdicion.reset();
  }

  // ACTUALIZAR REGISTRO EN LA LISTA
  actualizarListaEdicion(data: Doctor[]){
      this.listDoctores[this.posicionList]= data[0];
  }

  // PUT TAREAS TEMPLATES
  edit() {
      this.isSubmitDoctor= true;
      if(this.formEdicion.valid && this.isSubmitDoctor) {
          var model: any = {
              id: this.editDoctor.id,
              matricula: this.formEdicion.get('matricula').value.trim(),
              nombres: this.formEdicion.get('nombres').value.trim(),
              apellidos: this.formEdicion.get('apellidos').value.trim(),
              especialidad: this.formEdicion.get('especialidad').value.trim(),
              domicilio: this.formEdicion.get('domicilio').value.trim(),
              n_departamento: this.formEdicion.get('n_departamento').value,
              telefono: this.formEdicion.get('telefono').value.trim(),
              celular: this.formEdicion.get('celular').value.trim(),
              email: this.formEdicion.get('email').value.trim(),
              observaciones: this.formEdicion.get('observaciones').value.trim(),
          }
          this.loader= true;
          this.servicio.update(model)
          .subscribe(
              data => {
                  this.modalEditar.hide();
                  this.actualizarListaEdicion(data);
                  this.modificar = false;
                  this.loader= false;
                  this.toastyService.info("El doctor fue editado exitosamente");
                  this.isSubmitDoctor= false;
              },
              error => {
                  this.alert_server.messageError(error);
                  this.loader= false;
                  this.isSubmitDoctor= false;
              }
          );
      }else{
          // VALIDAR ANTES DE PUT
          this.formEdicion= this.fb.group({
              matricula: [this.formEdicion.get('matricula').value, Validators.compose([
                  Validators.required,
              ])],
              nombres: [this.formEdicion.get('nombres').value, Validators.compose([
                  Validators.required,
              ])],
              apellidos: [this.formEdicion.get('apellidos').value, Validators.compose([
                  Validators.required,
              ])],
              especialidad: [this.formEdicion.get('especialidad').value, Validators.compose([
                  Validators.required,
              ])],
              domicilio: [this.formEdicion.get('domicilio').value, Validators.compose([
                  Validators.required,
              ])],
              n_departamento: this.formEdicion.get('n_departamento').value,
              telefono: [this.formEdicion.get('telefono').value, Validators.compose([
                  Validators.required,
              ])],
              celular: [this.formEdicion.get('celular').value, Validators.compose([
                  Validators.required,
              ])],
              email: [this.formEdicion.get('email').value, Validators.compose([
                  Validators.required,
                  Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i)
              ])],
              observaciones: [this.formEdicion.get('observaciones').value, Validators.compose([
                  Validators.required,
              ])],
          })
      }
  }

  // RECIBIR FILA DE TAREAS Y MOSTRAR EN FORMULARIO DE ELIMINACION
  onDelete(data: Doctor, index: number){
      this.deleteDoctor= data;
      this.posicionList= index;
  }

  // DELETE TAREA TEMPLATE
  delete(){
    this.loader= true;
    this.servicio.delete(this.deleteDoctor.id)
    .subscribe(
        data => {
            this.actualizarListaEliminacion();
            $('#eliminar-doctor').modal('hide');
            this.toastyService.error("El doctor fue eliminado exitosamente");
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
      this.listDoctores.splice(this.posicionList, 1);
  }

}
