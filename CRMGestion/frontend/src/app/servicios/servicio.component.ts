import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, NgForm, FormGroup } from '@angular/forms';
import { ServicioService } from '../services/index';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { Validaciones } from '../validaciones/index'
import { ModalDirective } from 'ng2-bootstrap';
import { AlertServer } from '../global/index';
import { Servicio } from '../models/index';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

@Component({
    moduleId: module.id,
    selector: 'servicio',
    templateUrl: './servicio.html',
    providers: [ServicioService, AlertServer]
})

export class ServicioComponent implements OnInit{
    @ViewChild('modalCrear') public modalCrear:ModalDirective;
    @ViewChild('modalEditar') public modalEditar:ModalDirective;
    listServicios: Servicio[] = [];
    editServicios: Servicio;
    formCreacion: FormGroup;
    formEdicion: FormGroup;
    listFiltro: any = '';
    verValidacion: boolean= false;
    modificar: boolean= false;
    montoCreate: string;
    montoEdit: string;
    pagina: number= -1;
    posicionList: number;
    loader: boolean= false;
    isSubmitServicio: boolean = false;

    //OPCIONES DE MASK MONEY
    public numberMask = createNumberMask({
      prefix: '',
      suffix: '',
      thousandsSeparatorSymbol: '.'
    })
    public soloNumberMask = createNumberMask({
      prefix: '',
      suffix: '',
      integerLimit: 3
    });

    // FILTROS
    es_recurrente_filtro: string = '';
    habilitado_filtro: string = '1';
    nombre_filtro: string = '';
    descripcion_filtro: string = '';
    monto_sugerido_filtro: string = '';
    nombre_ord: string= '';

    constructor(
        private router: Router,
        private servicio: ServicioService,
        private fb: FormBuilder,
        private toastyService:ToastyService,
        private toastyConfig: ToastyConfig,
        private alert_server: AlertServer,
    ){
        // OPCIONES PREDETERMINADAS TASTY
        this.toastyConfig.theme = 'bootstrap';
        this.toastyConfig.timeout = 5000;
        this.toastyConfig.showClose = true;

        this.createForm();
    }

    // CARGA AUTOMATICA
    ngOnInit(){
        this.loadFilter();
    }

    // CREAR FORMULARIO
    createForm(){
        this.formCreacion= this.fb.group({
            nombre: ['', Validators.compose([
                Validators.required,
                Validators.maxLength(50),
                Validaciones.verificarEspacios,
            ])],
            descripcion: ['', Validators.compose([
                Validators.required,
                Validators.maxLength(200),
                Validaciones.verificarEspacios,
            ])],
            es_recurrente: ['', Validators.compose([
                Validators.required,
            ])],
            monto_sugerido: ['', Validators.compose([
                Validaciones.verificarMayorCero,
            ])],
            habilitado: ['', Validators.compose([
                Validators.required,
            ])],
        })
    }

    // CARGAR BUSQUEDA FILTRO
    loadSearch(){
        this.search(
            this.listFiltro.nombre,
            this.listFiltro.descripcion,
            this.listFiltro.es_recurrente,
            this.listFiltro.monto_sugerido,
            this.listFiltro.habilitado,
            this.listFiltro.nombrServicioe_ord,
        );
    }

    // CARGAR FILTRO
    loadFilter(){
        this.filter(
            this.listFiltro.nombre,
            this.listFiltro.descripcion,
            this.listFiltro.es_recurrente,
            this.listFiltro.monto_sugerido,
            this.listFiltro.habilitado,
            this.listFiltro.nombre_ord,
        );
    }

    // SETTEAR FILTROS DE BUSQUEDA VACIOS (NINGUNA)
    resetFilter(){
        this.es_recurrente_filtro= '';
        this.habilitado_filtro= '1';
        this.nombre_filtro= '';
        this.descripcion_filtro= '';
        this.monto_sugerido_filtro= '';
        this.nombre_ord= '';
    }

    // APLICAR FILTRADO
    filter(nombre: string, descripcion: string, es_recurrente: string, monto_sugerido: string, habilitado: string, nombre_ord: string){
        this.pagina = -1;
        this.listServicios = [];
        this.search(nombre, descripcion, es_recurrente, monto_sugerido, habilitado, nombre_ord);
    }

    // FILTROS DE BUSQUEDA
    search(nombre: string, descripcion: string, es_recurrente: string, monto_sugerido: string, habilitado: string, nombre_ord: string){
        this.pagina++;
        var model: any = {
            nombre: nombre,
            descripcion: descripcion,
            es_recurrente: es_recurrente,
            monto_sugerido: monto_sugerido,
            habilitado: habilitado,
            nombre_ord: nombre_ord,
            pagina: this.pagina,
        }
        this.listFiltro= model;
        this.servicio.search(model).subscribe(
          (lista)=>this.cargarListaServicios(lista),
          error => {
            this.alert_server.messageError(error);
          }
        );
    }
    cargarListaServicios(data: Servicio[]){
        this.listServicios = this.listServicios.concat(data);
    }

    // ABRIR MODAL DE CREACION
    showModalCrear():void {
        this.modalCrear.show();
    }

    // CERRAR MODAL DE CREACION
    hideModalCrear():void {
        this.modalCrear.hide();
        this.isSubmitServicio= false;
        this.resetCreateForm();
    }

    //RESETEAR FORMULARIO CREACION
    resetCreateForm(){
      this.formCreacion.reset({
          nombre: '',
          descripcion: '',
          es_recurrente: '',
          monto_sugerido: '',
          habilitado: '',
      })
    }

    // POST SERVICIO
    create() {
        this.isSubmitServicio= true;
        if(this.formCreacion.valid && this.isSubmitServicio) {
            var model: any = {
                nombre: this.formCreacion.get('nombre').value.trim(),
                descripcion: this.formCreacion.get('descripcion').value.trim(),
                es_recurrente: this.formCreacion.get('es_recurrente').value,
                monto_sugerido: this.formCreacion.get('monto_sugerido').value,
                habilitado: this.formCreacion.get('habilitado').value,
            }
            this.loader= true;
            this.servicio.create(model)
            .subscribe(
                data => {
                    this.hideModalCrear();
                    this.loadFilter();
                    this.toastyService.success("El servicio fue creado exitosamente");
                    this.loader= false;
                    this.isSubmitServicio= false;
                },
                error => {
                    this.alert_server.messageError(error);
                    this.loader= false;
                    this.isSubmitServicio= false;
                }
            );
        }else{
            // VALIDAR ANTES DE POST
            this.formCreacion= this.fb.group({
                nombre: [this.formCreacion.get('nombre').value, Validators.compose([
                    Validators.required,
                    Validators.maxLength(50),
                    Validaciones.verificarEspacios,
                ])],
                descripcion: [this.formCreacion.get('descripcion').value, Validators.compose([
                    Validators.required,
                    Validators.maxLength(200),
                    Validaciones.verificarEspacios,
                ])],
                es_recurrente: [this.formCreacion.get('es_recurrente').value, Validators.compose([
                    Validators.required,
                ])],
                monto_sugerido: [this.formCreacion.get('monto_sugerido').value, Validators.compose([
                    Validaciones.verificarMayorCero,
                ])],
                habilitado: [this.formCreacion.get('habilitado').value, Validators.compose([
                    Validators.required,
                ])],
            })
        }
    }

    // RECIBIR FILA DE SERVICIOS Y MOSTRAR EN FORMULARIO DE EDICION
    showModalEditar(servicios: Servicio, index: number){
        this.modalEditar.show();
        this.editServicios= servicios;
        this.posicionList= index;

        this.formEdicion= this.fb.group({
            nombre2: [servicios.nombre, Validators.compose([
                Validators.required,
                Validators.maxLength(50),
                Validaciones.verificarEspacios,
            ])],
            descripcion2: [servicios.descripcion, Validators.compose([
                Validators.required,
                Validators.maxLength(200),
                Validaciones.verificarEspacios,
            ])],
            es_recurrente2: [servicios.es_recurrente, Validators.compose([
                Validators.required,
            ])],
            monto_sugerido2: [servicios.monto_sugerido, Validators.compose([
                Validaciones.verificarMayorCero,
            ])],
            habilitado2: [servicios.habilitado, Validators.compose([
                Validators.required,
            ])],
        })
        this.verValidacion= false;
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
            this.isSubmitServicio= false;
            this.verValidacion= false;
            this.resetEditForm();
        }
    }

    // SALIR DE LA EDICION Y GUARDAR
    salirGuardar(){
        this.edit();
        $('#confirmar-cambios').modal('hide');
        this.isSubmitServicio= false;
        this.resetEditForm();
    }

    // SALIR DE LA EDICION Y NO GUARDAR
    salirSinGuardar(){
        this.modalEditar.hide();
        this.modificar = false;
        $('#confirmar-cambios').modal('hide');
        this.isSubmitServicio= false;
        this.verValidacion= false;
        this.resetEditForm();
    }

    // ACTUALIZAR REGISTRO EN LA LISTA
    actualizarListaEdicion(data: Servicio[]){
        this.listServicios[this.posicionList]= data[0];
    }

    //RESETEAR FORMULARIO EDICION
    resetEditForm(){
      this.formEdicion.reset({
          nombre2: '',
          descripcion2: '',
          es_recurrente2: '',
          monto_sugerido2: '',
          habilitado2: '',
      })
    }

    // PUT SERVICIO
    edit() {
        this.isSubmitServicio= true;
        if(this.formEdicion.valid && this.isSubmitServicio) {
            var model: any = {
                id: this.editServicios.id,
                nombre: this.formEdicion.get('nombre2').value.trim(),
                descripcion: this.formEdicion.get('descripcion2').value.trim(),
                es_recurrente: this.formEdicion.get('es_recurrente2').value,
                monto_sugerido: this.formEdicion.get('monto_sugerido2').value,
                habilitado: this.formEdicion.get('habilitado2').value,
            }
            this.loader= true;
            this.servicio.update(model)
            .subscribe(
                data => {
                    this.modalEditar.hide();
                    this.actualizarListaEdicion(data);
                    this.modificar = false;
                    this.verValidacion= false;
                    this.toastyService.info("El servicio fue editado exitosamente");
                    this.loader= false;
                    this.isSubmitServicio= false;
                },
                error => {
                    this.alert_server.messageError(error);
                    this.loader= false;
                    this.isSubmitServicio= false;
                }
            );
        }else{
            // VALIDAR ANTES DE PUT
            this.verValidacion= true;
            this.formEdicion= this.fb.group({
                nombre2: [this.formEdicion.get('nombre2').value, Validators.compose([
                    Validators.required,
                    Validators.maxLength(50),
                    Validaciones.verificarEspacios,
                ])],
                descripcion2: [this.formEdicion.get('descripcion2').value, Validators.compose([
                    Validators.required,
                    Validators.maxLength(200),
                    Validaciones.verificarEspacios,
                ])],
                es_recurrente2: [this.formEdicion.get('es_recurrente2').value, Validators.compose([
                    Validators.required,
                ])],
                monto_sugerido2: [this.formEdicion.get('monto_sugerido2').value, Validators.compose([
                    Validaciones.verificarMayorCero,
                ])],
                habilitado2: [this.formEdicion.get('habilitado2').value, Validators.compose([
                    Validators.required,
                ])],
            })
        }

    }

    // LIMIAR FILTRO
    cleanFilter(){
        this.resetFilter();
    }

}
