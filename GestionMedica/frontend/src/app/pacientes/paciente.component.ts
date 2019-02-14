import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, NgForm, FormGroup } from '@angular/forms';
import { PacienteService } from '../services/index';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { ModalDirective } from 'ngx-bootstrap';
import { AlertServer } from '../global/index';
import { Paciente, ObraSocial, Particular } from '../models/index';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { IMyOptions } from 'mydatepicker';

@Component({
    moduleId: module.id,
    selector: 'paciente',
    templateUrl: './paciente.html',
    providers: [PacienteService, AlertServer]
})

export class PacienteComponent implements OnInit{
  listPacientes: Paciente[]= [];
  listObrasSociales: ObraSocial[]= [];
  listParticulares: Particular[]= [];
  listFiltro: any = '';
  pagina: number= -1;
  @ViewChild('modalCrear') public modalCrear:ModalDirective;
  @ViewChild('modalEditar') public modalEditar:ModalDirective;
  formCreacion: FormGroup;
  formEdicion: FormGroup;
  isSubmitPaciente: boolean= false;
  loader: boolean= false;
  editPaciente: Paciente;
  deletePaciente: Paciente;
  posicionList: number;
  modificar: boolean= false;
  selectedOS: boolean= false;
  selectedParticular: boolean= false;
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
      selectionTxtFontSize: '1.3rem',
      dayLabels: { su: "Do", mo: "Lu", tu: "Ma", we: "Mi", th: "Ju", fr: "Vi", sa: "Sa" },
      monthLabels: { 1: "Ene", 2: "Feb", 3: "Mar", 4: "Abr", 5: "May", 6: "Jun", 7: "Jul", 8: "Ago", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dic" },
      todayBtnTxt: "Hoy",
      firstDayOfWeek: "mo",
      showInputField: true,
      openSelectorOnInputClick: true,
  }

  // FILTROS
  dni_filtro: string= '';
  fecha_nacimiento_filtro: string= '';
  nombres_filtro: string= '';
  apellidos_filtro: string= '';
  afiliado_filtro: string= '';
  domicilio_filtro: string= '';
  departamento_filtro: string= '';
  barrio_filtro: string= '';
  telefono_filtro: string= '';
  celular_filtro: string= '';
  email_filtro: string= '';
  observaciones_filtro: string= '';
  obra_social_filtro: string ='';
  plan_os_filtro: string ='';
  particular_filtro: string ='';
  nombres_ord: string;

  constructor(
    private servicio: PacienteService,
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
      this.loadObrasSociales();
      this.loadParticulares();
  }

  // CARGAR LISTADO DE OBRAS SOCIALES
  loadObrasSociales(){
      this.servicio.getObrasSociales().subscribe(data => { this.listObrasSociales = data; });
  }

  // CARGAR LISTADO DE PARTICULARES
  loadParticulares(){
      this.servicio.getParticulares().subscribe(data => { this.listParticulares = data; });
  }

  // CARGAR BUSQUEDA EN FILTRO
  loadSearch(){
      this.search(
          this.listFiltro.dni,
          this.listFiltro.fecha_nacimiento,
          this.listFiltro.nombres,
          this.listFiltro.apellidos,
          this.listFiltro.afiliado,
          this.listFiltro.domicilio,
          this.listFiltro.departamento,
          this.listFiltro.barrio,
          this.listFiltro.telefono,
          this.listFiltro.celular,
          this.listFiltro.email,
          this.listFiltro.observaciones,
          this.listFiltro.obra_social,
          this.listFiltro.plan_os_filtro,
          this.listFiltro.particular_filtro,
          this.listFiltro.nombres_ord
      );
  }

  // CARGAR FILTRO
  loadFilter(){
      this.filter(
        this.listFiltro.dni,
        this.listFiltro.fecha_nacimiento,
        this.listFiltro.nombres,
        this.listFiltro.apellidos,
        this.listFiltro.afiliado,
        this.listFiltro.domicilio,
        this.listFiltro.departamento,
        this.listFiltro.barrio,
        this.listFiltro.telefono,
        this.listFiltro.celular,
        this.listFiltro.email,
        this.listFiltro.observaciones,
        this.listFiltro.obra_social,
        this.listFiltro.plan_os_filtro,
        this.listFiltro.particular_filtro,
        this.listFiltro.nombres_ord
      );
  }

  // RESETEAR FILTRO A VACIO
  resetFilter(){
    this.dni_filtro= '';
    this.fecha_nacimiento_filtro= '';
    this.nombres_filtro= '';
    this.apellidos_filtro= '';
    this.afiliado_filtro= '';
    this.domicilio_filtro= '';
    this.departamento_filtro= '';
    this.barrio_filtro= '';
    this.telefono_filtro= '';
    this.celular_filtro= '';
    this.email_filtro= '';
    this.observaciones_filtro= '';
    this.obra_social_filtro= '';
    this.plan_os_filtro= '';
    this.particular_filtro= '';
    this.nombres_ord;
  }

  // APLICAR FILTRADO
  filter(dni: string, fecha_nacimiento: string, nombres: string, apellidos: string, afiliado: string, domicilio: string, departamento: string, barrio: string, telefono: string, celular: string, email: string, observaciones: string, obra_social: string, plan_os: string, particular: string, nombres_ord: string){
      this.pagina = -1;
      this.listPacientes = [];
      this.search(dni, fecha_nacimiento, nombres, apellidos, afiliado, domicilio, departamento, barrio, telefono, celular, email, observaciones, obra_social, plan_os, particular, nombres_ord);
  }

  // FUNCIONAMIENTO DE BOTON VER MÁS
  search(dni: string, fecha_nacimiento: string, nombres: string, apellidos: string, afiliado: string, domicilio: string, departamento: string, barrio: string, telefono: string, celular: string, email: string, observaciones: string, obra_social: string, plan_os: string, particular: string, nombres_ord: string){
      this.pagina++;
      var model: any = {
          dni: dni,
          fecha_nacimiento: fecha_nacimiento,
          nombres: nombres,
          apellidos: apellidos,
          afiliado: afiliado,
          domicilio: domicilio,
          departamento: departamento,
          barrio: barrio,
          telefono: telefono,
          celular: celular,
          email: email,
          observaciones: observaciones,
          obra_social: obra_social,
          plan_os: plan_os,
          particular: particular,
          nombres_ord: nombres_ord,
          pagina: this.pagina,
      }
      this.listFiltro= model;
      this.servicio.search(model).subscribe((lista)=>this.cargarLista(lista));
  }

  cargarLista(data: Paciente[]){
      this.listPacientes = this.listPacientes.concat(data);
  }

  // LIMIAR FILTRO
  cleanFilter(){
      this.resetFilter();
  }

  // CREACION DE FORMULARIO DE CREACION
  createForm(){
      this.formCreacion= this.fb.group({
          dni: ['', Validators.compose([
              Validators.required,
          ])],
          fecha_nacimiento: ['', Validators.compose([
              Validators.required,
          ])],
          nombres: ['', Validators.compose([
              Validators.required,
          ])],
          apellidos: ['', Validators.compose([
              Validators.required,
          ])],
          domicilio: ['', Validators.compose([
              Validators.required,
          ])],
          n_departamento: '',
          barrio: ['', Validators.compose([
              Validators.required,
          ])],
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
          id_obra_social: '',
          plan_os: '',
          n_afiliado: '',
          id_particular: ''
      })
  }

  // ABRIR MODAL DE CREACION
  showModalCrear():void {
      this.modalCrear.show();
      this.selectedOS= false;
      this.selectedParticular= false;
  }

  // CERRAR MODAL DE CREACION
  hideModalCrear():void {
      this.modalCrear.hide();
      this.isSubmitPaciente= false;
      this.formCreacion.reset();
      this.formCreacion.patchValue({id_obra_social: '', id_particular: ''});
  }

  // POST ROL DE CONTACTO
  create() {
      this.isSubmitPaciente= true;
      if(this.formCreacion.valid && this.isSubmitPaciente){
          var model: any = {
              dni: this.formCreacion.get('dni').value.trim(),
              fecha_nacimiento: this.formCreacion.get('fecha_nacimiento').value.formatted,
              nombres: this.formCreacion.get('nombres').value.trim(),
              apellidos: this.formCreacion.get('apellidos').value.trim(),
              domicilio: this.formCreacion.get('domicilio').value.trim(),
              n_departamento: this.formCreacion.get('n_departamento').value,
              barrio: this.formCreacion.get('barrio').value.trim(),
              telefono: this.formCreacion.get('telefono').value.trim(),
              celular: this.formCreacion.get('celular').value.trim(),
              email: this.formCreacion.get('email').value.trim(),
              observaciones: this.formCreacion.get('observaciones').value.trim(),
              id_obra_social: this.formCreacion.get('id_obra_social').value,
              plan_os: this.formCreacion.get('plan_os').value,
              n_afiliado: this.formCreacion.get('n_afiliado').value,
              id_particular: this.formCreacion.get('id_particular').value,
          }
          this.loader= true;
          this.servicio.create(model)
          .subscribe(
              data => {
                  this.hideModalCrear();
                  this.loadFilter();
                  this.toastyService.success("El paciente fue creado exitosamente");
                  this.loader= false;
                  this.isSubmitPaciente= false;
                  this.formCreacion.reset();
                  this.formCreacion.patchValue({id_obra_social: '', id_particular: ''});
              },
              error => {
                  this.alert_server.messageError(error);
                  this.loader= false;
                  this.isSubmitPaciente= false;
              }
          );
      }else{
          // VALIDACION ANTES DE POST
          this.formCreacion= this.fb.group({
              dni: [this.formCreacion.get('dni').value, Validators.compose([
                  Validators.required,
              ])],
              fecha_nacimiento: [this.formCreacion.get('fecha_nacimiento').value, Validators.compose([
                  Validators.required,
              ])],
              nombres: [this.formCreacion.get('nombres').value, Validators.compose([
                  Validators.required,
              ])],
              apellidos: [this.formCreacion.get('apellidos').value, Validators.compose([
                  Validators.required,
              ])],
              domicilio: [this.formCreacion.get('domicilio').value, Validators.compose([
                  Validators.required,
              ])],
              n_departamento: this.formCreacion.get('n_departamento').value,
              barrio: [this.formCreacion.get('barrio').value, Validators.compose([
                  Validators.required,
              ])],
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
              id_obra_social: this.formCreacion.get('id_obra_social').value,
              plan_os: this.formCreacion.get('plan_os').value,
              n_afiliado: this.formCreacion.get('n_afiliado').value,
              id_particular: this.formCreacion.get('id_particular').value,
          })
      }
  }

  // VERIFICAR SI SE SELECCIONA OS
  verificarOS(data: any){
    if (data != '') {
        this.selectedOS= true;
    }else{
        this.selectedOS= false;
    }
  }

  // VERIFICAR SI SE SELECCIONA PARTICULAR
  verificarParticular(data: any){
    if (data != '') {
        this.selectedParticular= true;
        this.formCreacion.patchValue({plan_os: '', n_afiliado: ''});
        if (this.formEdicion) {
          this.formEdicion.patchValue({plan_os: '', n_afiliado: ''});
        }
    }else{
        this.selectedParticular= false;
    }
  }

  // RECIBIR FILA DE TAREAS Y MOSTRAR EN FORMULARIO DE EDICION
  showModalEditar(data: Paciente, index: number){
      this.modalEditar.show();
      this.editPaciente= data;
      this.posicionList= index;
      this.selectedOS= false;
      this.selectedParticular= false;

      // TRANSFORMAR FECHA EN OBJETO PARA MOSTRAT EN DATEPICKER
      var newFechaNacimiento= new Date(data.fecha_nacimiento);
      var fechaNacimientoObjeto = { date: { year: newFechaNacimiento.getUTCFullYear(), month: newFechaNacimiento.getUTCMonth() + 1, day: newFechaNacimiento.getUTCDate() } };

      if (data.id_obra_social) {
          var obra_social: any = data.id_obra_social;
          this.selectedOS= true;
      }else{
          var obra_social: any = '';
          this.selectedOS= false;
      }

      if (data.id_particular) {
          var particular: any = data.id_particular;
          this.selectedParticular= true;
      }else{
          var particular: any = '';
          this.selectedParticular= false;
      }

      this.formEdicion= this.fb.group({
          dni: [data.dni, Validators.compose([
              Validators.required,
          ])],
          fecha_nacimiento: [fechaNacimientoObjeto, Validators.compose([
              Validators.required,
          ])],
          nombres: [data.nombres, Validators.compose([
              Validators.required,
          ])],
          apellidos: [data.apellidos, Validators.compose([
              Validators.required,
          ])],
          domicilio: [data.domicilio, Validators.compose([
              Validators.required,
          ])],
          n_departamento: data.n_departamento,
          barrio: [data.barrio, Validators.compose([
              Validators.required,
          ])],
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
          id_obra_social: obra_social,
          plan_os: data.plan_os,
          n_afiliado: data.n_afiliado,
          id_particular: particular,
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
          this.isSubmitPaciente= false;
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
      this.isSubmitPaciente= false;
      this.formEdicion.reset();
  }

  // ACTUALIZAR REGISTRO EN LA LISTA
  actualizarListaEdicion(data: Paciente[]){
      this.listPacientes[this.posicionList]= data[0];
  }

  // PUT TAREAS TEMPLATES
  edit() {
      this.isSubmitPaciente= true;
      if(this.formEdicion.valid && this.isSubmitPaciente) {
          var model: any = {
              id: this.editPaciente.id,
              dni: this.formEdicion.get('dni').value.trim(),
              fecha_nacimiento: this.formEdicion.get('fecha_nacimiento').value.formatted,
              nombres: this.formEdicion.get('nombres').value.trim(),
              apellidos: this.formEdicion.get('apellidos').value.trim(),
              domicilio: this.formEdicion.get('domicilio').value.trim(),
              n_departamento: this.formEdicion.get('n_departamento').value,
              barrio: this.formEdicion.get('barrio').value.trim(),
              telefono: this.formEdicion.get('telefono').value.trim(),
              celular: this.formEdicion.get('celular').value.trim(),
              email: this.formEdicion.get('email').value.trim(),
              observaciones: this.formEdicion.get('observaciones').value.trim(),
              id_obra_social: this.formEdicion.get('id_obra_social').value,
              plan_os: this.formEdicion.get('plan_os').value,
              n_afiliado: this.formEdicion.get('n_afiliado').value,
              id_particular: this.formEdicion.get('id_particular').value,
          }
          this.loader= true;
          this.servicio.update(model)
          .subscribe(
              data => {
                  this.modalEditar.hide();
                  this.actualizarListaEdicion(data);
                  this.modificar = false;
                  this.loader= false;
                  this.toastyService.info("El paciente fue editado exitosamente");
                  this.isSubmitPaciente= false;
              },
              error => {
                  this.alert_server.messageError(error);
                  this.loader= false;
                  this.isSubmitPaciente= false;
              }
          );
      }else{
          // VALIDAR ANTES DE PUT
          this.formEdicion= this.fb.group({
              dni: [this.formEdicion.get('dni').value, Validators.compose([
                  Validators.required,
              ])],
              fecha_nacimiento: [this.formEdicion.get('fecha_nacimiento').value, Validators.compose([
                  Validators.required,
              ])],
              nombres: [this.formEdicion.get('nombres').value, Validators.compose([
                  Validators.required,
              ])],
              apellidos: [this.formEdicion.get('apellidos').value, Validators.compose([
                  Validators.required,
              ])],
              domicilio: [this.formEdicion.get('domicilio').value, Validators.compose([
                  Validators.required,
              ])],
              n_departamento: this.formEdicion.get('n_departamento').value,
              barrio: [this.formEdicion.get('barrio').value, Validators.compose([
                  Validators.required,
              ])],
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
              id_obra_social: this.formEdicion.get('id_obra_social').value,
              plan_os: this.formEdicion.get('plan_os').value,
              n_afiliado: this.formEdicion.get('n_afiliado').value,
              id_particular: this.formEdicion.get('id_particular').value,
          })
      }
  }

  // RECIBIR FILA DE TAREAS Y MOSTRAR EN FORMULARIO DE ELIMINACION
  onDelete(data: Paciente, index: number){
      this.deletePaciente= data;
      this.posicionList= index;
  }

  // DELETE TAREA TEMPLATE
  delete(){
    this.loader= true;
    this.servicio.delete(this.deletePaciente.id)
    .subscribe(
        data => {
            this.actualizarListaEliminacion();
            $('#eliminar-paciente').modal('hide');
            this.toastyService.error("El paciente fue eliminado exitosamente");
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
      this.listPacientes.splice(this.posicionList, 1);
  }

}
