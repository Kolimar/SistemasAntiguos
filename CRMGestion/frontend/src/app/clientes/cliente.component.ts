import { Component, OnInit, ViewChild } from '@angular/core';
import { Tarea, TareaTemplate, Cliente, Servicio, User, Subtarea, Brief } from '../models/index';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { ClienteService } from '../services/index';
import { AlertServer } from '../global/index';
import { IMyOptions } from 'mydatepicker';
import { FormBuilder, Validators, NgForm, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ng2-bootstrap';

@Component({
    moduleId: module.id,
    selector: 'cliente',
    templateUrl: './cliente.html',
    providers: [ClienteService, AlertServer]
})

export class ClienteComponent implements OnInit{
  listClientes: Cliente[]= [];
  listFiltro: any = '';
  pagina: number= -1;
  deleteCliente: Cliente;
  posicionList: number;
  loader: boolean= false;
  formEliminacion: FormGroup;
  isSubmitDelete: boolean = false;
  @ViewChild('modalEliminar') public modalEliminar:ModalDirective;

  // FILTROS
  nombre_filtro: string= '';
  fecha_filtro: string= '';
  pm_asignado_filtro:string= '';
  estado_filtro: string= '1';
  nombre_ord: string= '';
  fecha_ord: string= '';

  // OPCIONES DE PLUGING DATEPICKER
  myDatePickerOptions: IMyOptions = {
      dateFormat: 'dd-mm-yyyy',
      editableDateField: false,
      disableWeekends: true,
      selectionTxtFontSize: '1.3rem',
      dayLabels: { su: "Do", mo: "Lu", tu: "Ma", we: "Mi", th: "Ju", fr: "Vi", sa: "Sa" },
      monthLabels: { 1: "Ene", 2: "Feb", 3: "Mar", 4: "Abr", 5: "May", 6: "Jun", 7: "Jul", 8: "Ago", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dic" },
      todayBtnTxt: "Hoy",
      firstDayOfWeek: "mo",
      showInputField: true,
      openSelectorOnInputClick: true
  }

  constructor(
    private servicio: ClienteService,
    private alert_server: AlertServer,
    private toastyService:ToastyService,
    private toastyConfig: ToastyConfig,
    private fb: FormBuilder,
  ){

    this.createForm();

  }

  // CARGA AUTOMATICA
  ngOnInit(){
    this.loadFilter();
  }

  // CARGAR BUSQUEDA EN FILTRO
  loadSearch(){
      this.search(
        this.listFiltro.nombre,
        this.listFiltro.fecha_comienzo,
        this.listFiltro.pm_asignado,
        this.listFiltro.estado,
        this.listFiltro.nombre_ord,
        this.listFiltro.fecha_ord
      );
  }

  // CARGAR FILTRO
  loadFilter(){
      this.filter(
        this.listFiltro.nombre,
        this.listFiltro.fecha_comienzo,
        this.listFiltro.pm_asignado,
        this.listFiltro.estado,
        this.listFiltro.nombre_ord,
        this.listFiltro.fecha_ord
      );
  }

  // APLICAR FILTRADO
  filter(nombre: string, fecha_comienzo: string, pm_asignado: string, estado: string, nombre_ord: string, fecha_ord: string){
      this.pagina = -1;
      this.listClientes = [];
      this.search(nombre, fecha_comienzo, pm_asignado, estado, nombre_ord, fecha_ord);
  }

  // FILTROS DE BUSQUEDA y ORDENAMIENTO
  search(nombre: string, fecha_comienzo: string, pm_asignado: string, estado: string, nombre_ord: string, fecha_ord: string){
      this.pagina++;
      var model: any = {
          nombre: nombre,
          fecha_comienzo: fecha_comienzo,
          pm_asignado: pm_asignado,
          estado: estado,
          nombre_ord: nombre_ord,
          fecha_ord: fecha_ord,
          pagina: this.pagina,
      }
      this.listFiltro= model;
      this.servicio.search(model).subscribe((lista)=>this.cargarListaBriefs(lista));
  }
  cargarListaBriefs(data: Cliente[]){
      this.listClientes = this.listClientes.concat(data);
  }

  // LIMPIAR FILTROS
  resetFilter(){
    this.nombre_filtro= '';
    this.fecha_filtro= '';
    this.pm_asignado_filtro= '';
    this.estado_filtro= '1';
    this.nombre_ord= '';
    this.fecha_ord= '';
  }

  // CLEAN FILTROS
  cleanFilter(){
      this.resetFilter();
  }

  createForm(){
    this.formEliminacion= this.fb.group({
        fecha_baja: ['', Validators.compose([
            Validators.required,
        ])],
        motivo_baja: ['', Validators.compose([
            Validators.required,
        ])],
    })
  }

  // RECIBIR FILA DE BRIEF Y MOSTRAR EN FORMULARIO DE ELIMINACION
  onDelete(cliente: Cliente, index: number){
      this.createForm();
      this.modalEliminar.show();
      this.deleteCliente= cliente;
      this.posicionList= index;
  }

  // DELETE TAREA TEMPLATE
  delete(){
    this.isSubmitDelete= true;

    if (this.formEliminacion.valid && this.isSubmitDelete) {

      var fecha_baja: any = [this.formEliminacion.get('fecha_baja').value.date.year, this.formEliminacion.get('fecha_baja').value.date.month, this.formEliminacion.get('fecha_baja').value.date.day].join('-');

      let model : any = {
        fecha_baja: fecha_baja,
        motivo_baja: this.formEliminacion.get('motivo_baja').value
      }
      this.loader= true;
      this.servicio.delete(model, this.deleteCliente.id)
      .subscribe(
          data => {
              this.modalEliminar.hide();
              this.toastyService.error("El cliente será dado de baja en la fecha ingresada");
              this.loader= false;
              this.isSubmitDelete= false;
          },
          error => {
             this.alert_server.messageError(error);
             this.loader= false;
          }
      );

    }else{

      this.formEliminacion= this.fb.group({
          fecha_baja: [this.formEliminacion.get('fecha_baja').value, Validators.compose([
              Validators.required,
          ])],
          motivo_baja: [this.formEliminacion.get('motivo_baja').value, Validators.compose([
              Validators.required,
          ])],
      })

    }

  }

  hideModalEliminar(){
    this.modalEliminar.hide();
    this.isSubmitDelete= false;
    this.resetEliminateForm();
  }

  resetEliminateForm(){
    this.formEliminacion.reset({
        fecha_baja: '',
        motivo_baja: '',
    })
  }

}
