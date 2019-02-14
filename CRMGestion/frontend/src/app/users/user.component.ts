import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, NgForm, FormGroup } from '@angular/forms';
import { TareaTemplateService, UserService } from '../services/index';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { ModalDirective } from 'ng2-bootstrap';
import { AlertServer } from '../global/index';
import { User } from '../models/index';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

interface Puesto {
    id: number;
    nombre: string;
}

@Component({
    moduleId: module.id,
    selector: 'user',
    templateUrl: './user.html',
    providers: [UserService, AlertServer]
})

export class UserComponent implements OnInit{
  listUsers: User[]= [];
  listFiltro: any = '';
  pagina: number= -1;
  @ViewChild('modalCrear') public modalCrear:ModalDirective;
  @ViewChild('modalEditar') public modalEditar:ModalDirective;
  formCreacion: FormGroup;
  formEdicion: FormGroup;
  isSubmitUser: boolean= false;
  loader: boolean= false;
  editUser: User;
  deleteUser: User;
  posicionList: number;
  modificar: boolean= false;
  listPuestos: Puesto[]= [];
  currentUser: any;

  public onlyNumberMask = createNumberMask({
    prefix: '',
    suffix: '',
    decimalSymbol: '',
    thousandsSeparatorSymbol: '',
  });

  // FILTROS
  nombres_filtro: string= '';
  apellidos_filtro: string= '';
  puesto_filtro: string= '';
  telefono_laboral_filtro: string= '';
  celular_laboral_filtro: string= '';
  email_laboral_filtro: string= '';
  telefono_personal_filtro: string= '';
  celular_personal_filtro: string= '';
  email_personal_filtro: string= '';
  habilitado_filtro: string= '';
  nombres_ord: string;

  constructor(
    private servicio: UserService,
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
      this.loadPuestos();
      this.loadCurrentUser();
  }

  // CARGAR LISTADO DE PUESTOS
  loadPuestos() {
      this.servicio.getPuestos().subscribe(
        listPuestos => { this.listPuestos = listPuestos; },
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
          this.listFiltro.nombres,
          this.listFiltro.apellidos,
          this.listFiltro.puesto,
          this.listFiltro.telefono_laboral,
          this.listFiltro.celular_laboral,
          this.listFiltro.email_laboral,
          this.listFiltro.telefono_personal,
          this.listFiltro.celular_personal,
          this.listFiltro.email_personal,
          this.listFiltro.habilitado,
          this.listFiltro.nombres_ord
      );
  }

  // CARGAR FILTRO
  loadFilter(){
      this.filter(
        this.listFiltro.nombres,
        this.listFiltro.apellidos,
        this.listFiltro.puesto,
        this.listFiltro.telefono_laboral,
        this.listFiltro.celular_laboral,
        this.listFiltro.email_laboral,
        this.listFiltro.telefono_personal,
        this.listFiltro.celular_personal,
        this.listFiltro.email_personal,
        this.listFiltro.habilitado,
        this.listFiltro.nombres_ord
      );
  }

  // RESETEAR FILTRO A VACIO
  resetFilter(){
    this.nombres_filtro= '';
    this.apellidos_filtro= '';
    this.puesto_filtro= '';
    this.telefono_laboral_filtro= '';
    this.celular_laboral_filtro= '';
    this.email_laboral_filtro= '';
    this.telefono_personal_filtro= '';
    this.celular_personal_filtro= '';
    this.email_personal_filtro= '';
    this.habilitado_filtro= '';
    this.nombres_ord;
  }

  // APLICAR FILTRADO
  filter(nombres: string, apellidos: string, puesto: string, telefono_laboral: string, celular_laboral: string, email_laboral: string, telefono_personal: string, celular_personal: string, email_personal: string, habilitado: string, nombres_ord: string){
      this.pagina = -1;
      this.listUsers = [];
      this.search(nombres, apellidos, puesto, telefono_laboral, celular_laboral, email_laboral, telefono_personal, celular_personal, email_personal, habilitado, nombres_ord);
  }

  // FUNCIONAMIENTO DE BOTON VER MÁS
  search(nombres: string, apellidos: string, puesto: string, telefono_laboral: string, celular_laboral: string, email_laboral: string, telefono_personal: string, celular_personal: string, email_personal: string, habilitado: string, nombres_ord: string){
      this.pagina++;
      var model: any = {
          nombres: nombres,
          apellidos: apellidos,
          puesto: puesto,
          telefono_laboral: telefono_laboral,
          celular_laboral: celular_laboral,
          email_laboral: email_laboral,
          telefono_personal: telefono_personal,
          celular_personal: celular_personal,
          email_personal: email_personal,
          habilitado: habilitado,
          nombres_ord: nombres_ord,
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

  cargarListaTareasTemplate(data: User[]){
      this.listUsers = this.listUsers.concat(data);
  }

  // LIMIAR FILTRO
  cleanFilter(){
      this.resetFilter();
  }

  // CREACION DE FORMULARIO DE CREACION
  createForm(){
    this.formCreacion= this.fb.group({
        nombres: ['', Validators.compose([
            Validators.required,
        ])],
        apellidos: ['', Validators.compose([
            Validators.required,
        ])],
        email_laboral: ['', Validators.compose([
            Validators.required,
            Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i)
        ])],
        email_personal: ['', Validators.compose([
            Validators.required,
            Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i)
        ])],
        celular_laboral: ['', Validators.compose([
            Validators.required,
        ])],
        celular_personal: ['', Validators.compose([
            Validators.required,
        ])],
        telefono_laboral: ['', Validators.compose([
            Validators.required,
        ])],
        telefono_personal: ['', Validators.compose([
            Validators.required,
        ])],
        habilitado: ['', Validators.compose([
            Validators.required,
        ])],
        password: ['', Validators.compose([
            Validators.required,
        ])],
        id_puesto: ['', Validators.compose([
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
      this.isSubmitUser= false;
      this.formCreacion.reset();
      this.formCreacion.patchValue({id_puesto: '', habilitado: ''});
  }

  // POST ROL DE CONTACTO
  create() {
      this.isSubmitUser= true;
      if(this.formCreacion.valid && this.isSubmitUser){
          var model: any = {
              nombres: this.formCreacion.get('nombres').value.trim(),
              apellidos: this.formCreacion.get('apellidos').value.trim(),
              email_laboral: this.formCreacion.get('email_laboral').value.trim(),
              email_personal: this.formCreacion.get('email_personal').value.trim(),
              celular_laboral: this.formCreacion.get('celular_laboral').value.trim(),
              celular_personal: this.formCreacion.get('celular_personal').value.trim(),
              telefono_laboral: this.formCreacion.get('telefono_laboral').value.trim(),
              telefono_personal: this.formCreacion.get('telefono_personal').value.trim(),
              habilitado: this.formCreacion.get('habilitado').value,
              password: this.formCreacion.get('password').value.trim(),
              id_puesto: this.formCreacion.get('id_puesto').value,
          }
          this.loader= true;
          this.servicio.create(model)
          .subscribe(
              data => {
                  this.hideModalCrear();
                  this.loadFilter();
                  this.toastyService.success("El usuario fue creado exitosamente");
                  this.loader= false;
                  this.isSubmitUser= false;
                  this.formCreacion.reset();
              },
              error => {
                  this.alert_server.messageError(error);
                  this.loader= false;
                  this.isSubmitUser= false;
              }
          );
      }else{
          // VALIDACION ANTES DE POST
          this.formCreacion= this.fb.group({
              nombres: [this.formCreacion.get('nombres').value, Validators.compose([
                  Validators.required,
              ])],
              apellidos: [this.formCreacion.get('apellidos').value, Validators.compose([
                  Validators.required,
              ])],
              email_laboral: [this.formCreacion.get('email_laboral').value, Validators.compose([
                  Validators.required,
                  Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i)
              ])],
              email_personal: [this.formCreacion.get('email_personal').value, Validators.compose([
                  Validators.required,
                  Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i)
              ])],
              celular_laboral: [this.formCreacion.get('celular_laboral').value, Validators.compose([
                  Validators.required,
              ])],
              celular_personal: [this.formCreacion.get('celular_personal').value, Validators.compose([
                  Validators.required,
              ])],
              telefono_laboral: [this.formCreacion.get('telefono_laboral').value, Validators.compose([
                  Validators.required,
              ])],
              telefono_personal: [this.formCreacion.get('telefono_personal').value, Validators.compose([
                  Validators.required,
              ])],
              habilitado: [this.formCreacion.get('habilitado').value, Validators.compose([
                  Validators.required,
              ])],
              password: [this.formCreacion.get('password').value, Validators.compose([
                  Validators.required,
              ])],
              id_puesto: [this.formCreacion.get('id_puesto').value, Validators.compose([
                  Validators.required,
              ])],
          })
      }
  }

  // RECIBIR FILA DE TAREAS Y MOSTRAR EN FORMULARIO DE EDICION
  showModalEditar(user: User, index: number){
      this.modalEditar.show();
      this.editUser= user;
      this.posicionList= index;

      this.formEdicion= this.fb.group({
          nombres: [user.nombres, Validators.compose([
              Validators.required,
          ])],
          apellidos: [user.apellidos, Validators.compose([
              Validators.required,
          ])],
          email_laboral: [user.email_laboral, Validators.compose([
              Validators.required,
              Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i)
          ])],
          email_personal: [user.email_personal, Validators.compose([
              Validators.required,
              Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i)
          ])],
          celular_laboral: [user.celular_laboral, Validators.compose([
              Validators.required,
          ])],
          celular_personal: [user.celular_personal, Validators.compose([
              Validators.required,
          ])],
          telefono_laboral: [user.telefono_laboral, Validators.compose([
              Validators.required,
          ])],
          telefono_personal: [user.telefono_personal, Validators.compose([
              Validators.required,
          ])],
          habilitado: [user.habilitado, Validators.compose([
              Validators.required,
          ])],
          id_puesto: [user.id_puesto, Validators.compose([
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
          this.isSubmitUser= false;
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
      this.isSubmitUser= false;
      this.formEdicion.reset();
  }

  // ACTUALIZAR REGISTRO EN LA LISTA
  actualizarListaEdicion(data: User[]){
      this.listUsers[this.posicionList]= data[0];
  }

  // PUT TAREAS TEMPLATES
  edit() {
      this.isSubmitUser= true;
      if(this.formEdicion.valid && this.isSubmitUser) {
          var model: any = {
              id: this.editUser.id,
              nombres: this.formEdicion.get('nombres').value.trim(),
              apellidos: this.formEdicion.get('apellidos').value.trim(),
              email_laboral: this.formEdicion.get('email_laboral').value.trim(),
              email_personal: this.formEdicion.get('email_personal').value.trim(),
              celular_laboral: this.formEdicion.get('celular_laboral').value.trim(),
              celular_personal: this.formEdicion.get('celular_personal').value.trim(),
              telefono_laboral: this.formEdicion.get('telefono_laboral').value.trim(),
              telefono_personal: this.formEdicion.get('telefono_personal').value.trim(),
              habilitado: this.formEdicion.get('habilitado').value,
              id_puesto: this.formEdicion.get('id_puesto').value,
          }
          this.loader= true;
          this.servicio.update(model)
          .subscribe(
              data => {
                  this.modalEditar.hide();
                  this.actualizarListaEdicion(data);
                  this.modificar = false;
                  this.loader= false;
                  this.toastyService.info("El usuario fue editado exitosamente");
                  this.isSubmitUser= false;
              },
              error => {
                  this.alert_server.messageError(error);
                  this.loader= false;
                  this.isSubmitUser= false;
              }
          );
      }else{
          // VALIDAR ANTES DE PUT
          this.formEdicion= this.fb.group({
              nombres: [this.formEdicion.get('nombres').value, Validators.compose([
                  Validators.required,
              ])],
              apellidos: [this.formEdicion.get('apellidos').value, Validators.compose([
                  Validators.required,
              ])],
              email_laboral: [this.formEdicion.get('email_laboral').value, Validators.compose([
                  Validators.required,
                  Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i)
              ])],
              email_personal: [this.formEdicion.get('email_personal').value, Validators.compose([
                  Validators.required,
                  Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i)
              ])],
              celular_laboral: [this.formEdicion.get('celular_laboral').value, Validators.compose([
                  Validators.required,
              ])],
              celular_personal: [this.formEdicion.get('celular_personal').value, Validators.compose([
                  Validators.required,
              ])],
              telefono_laboral: [this.formEdicion.get('telefono_laboral').value, Validators.compose([
                  Validators.required,
              ])],
              telefono_personal: [this.formEdicion.get('telefono_personal').value, Validators.compose([
                  Validators.required,
              ])],
              habilitado: [this.formEdicion.get('habilitado').value, Validators.compose([
                  Validators.required,
              ])],
              id_puesto: [this.formEdicion.get('id_puesto').value, Validators.compose([
                  Validators.required,
              ])],
          })
      }
  }

  // RECIBIR FILA DE TAREAS Y MOSTRAR EN FORMULARIO DE ELIMINACION
  onDelete(user: User, index: number){
      this.deleteUser= user;
      this.posicionList= index;
  }

  // DELETE TAREA TEMPLATE
  delete(){
    this.loader= true;
    this.servicio.delete(this.deleteUser.id)
    .subscribe(
        data => {
            this.actualizarListaEliminacion();
            $('#eliminar-user').modal('hide');
            this.toastyService.error("El usuario fue eliminado exitosamente");
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
      this.listUsers.splice(this.posicionList, 1);
  }

}
