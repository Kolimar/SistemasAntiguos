import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, NgForm, FormGroup } from '@angular/forms';
import { TareaTemplateService, TareaService } from '../services/index';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { Validaciones } from '../validaciones/index';
import { ModalDirective } from 'ng2-bootstrap';
import { AlertServer } from '../global/index';
import { TareaTemplate, TipoTarea } from '../models/index';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

@Component({
    moduleId: module.id,
    selector: 'tarea-template',
    templateUrl: './tarea-template.html',
    providers: [TareaTemplateService, TareaService, AlertServer]
})

export class TareaTemplateComponent implements OnInit{
    @ViewChild('modalCrear') public modalCrear:ModalDirective;
    @ViewChild('modalEditar') public modalEditar:ModalDirective;
    listTareasTemplates: TareaTemplate[] = [];
    editTareasTemplates: TareaTemplate;
    deleteTareasTemplates: TareaTemplate;
    formCreacion: FormGroup;
    formEdicion: FormGroup;
    listFiltro: any = '';
    modificar: boolean = false;
    verValidacion: boolean = false;
    data: TareaTemplate[] = [];
    pagina: number= -1;
    posicionList: number;
    loader: boolean= false;
    isSubmitTareaTemplate: boolean = false;
    verificarDescripcion: string;
    cmbTiposTareas: TipoTarea[]= [];
    public numberMask = createNumberMask({
      prefix: '',
      suffix: '',
      integerLimit: 3
    });

    // FILTROS
    es_critica_filtro: string = '';
    ultimo_milestone_filtro: string = '';
    asigna_pm_automatico_filtro: string = '';
    titulo_filtro: string = '';
    tipo_tarea_filtro: string = '';
    descripcion_filtro: string = '';
    dias_sugeridos_filtro: string = '';
    titulo_ord: string;

    constructor(
        private router: Router,
        private servicio: TareaTemplateService,
        private servicioTarea: TareaService,
        private fb: FormBuilder,
        private toastyService:ToastyService,
        private toastyConfig: ToastyConfig,
        private alert_server: AlertServer,
    ){

        // OPCIONES PREDETERMINADAS TASTY
        this.toastyConfig.theme = 'bootstrap';
        this.toastyConfig.timeout = 5000;
        this.toastyConfig.showClose = true;

        // REGLAS DE VALIDACION
        this.createForm();

    }

    // CARGA AUTOMATICA
    ngOnInit() {
        this.loadFilter();
        this.loadTiposTareas();
    }

    // CARGA DEL COMBO TAREAS
    loadTiposTareas(){
        this.servicioTarea.getTiposTareas().subscribe(
          cmbTiposTareas => { this.cmbTiposTareas = cmbTiposTareas; },
          error => {
            this.alert_server.messageError(error);
          }
        );
    }

    // CREACION DE FORMULARIO DE CREACIO
    createForm(){
        this.formCreacion= this.fb.group({
            titulo: ['', Validators.compose([
                Validators.required,
                Validators.maxLength(50),
                Validaciones.verificarEspacios,
            ])],
            descripcion: ['', Validators.compose([
                Validators.required,
                Validaciones.verificarEspacios,
            ])],
            id_tipo_tarea: [1, Validators.compose([
                Validators.required,
            ])],
            es_critica: ['', Validators.compose([
                Validators.required,
            ])],
            ultimo_milestone: ['', Validators.compose([
                Validators.required,
            ])],
            dias_sugeridos: ['', Validators.compose([
                Validators.required,
                Validators.pattern(/^(?:36[0-5]|3[0-5][0-9]|[12][0-9][0-9]|[1-9][0-9]|[1-9])$/im),
            ])],
            asigna_pm_automatico: ['', Validators.compose([
                Validators.required,
            ])],
        })
    }

    // CARGAR BUSQUEDA EN FILTRO
    loadSearch(){
        this.search(
            this.listFiltro.titulo,
            this.listFiltro.descripcion,
            this.tipo_tarea_filtro,
            this.listFiltro.es_critica,
            this.listFiltro.ultimo_milestone,
            this.listFiltro.dias_sugeridos,
            this.listFiltro.asigna_pm_automatico,
            this.listFiltro.titulo_ord
        );
    }

    // CARGAR FILTRO
    loadFilter(){
        this.filter(
            this.listFiltro.titulo,
            this.listFiltro.descripcion,
            this.tipo_tarea_filtro,
            this.listFiltro.es_critica,
            this.listFiltro.ultimo_milestone,
            this.listFiltro.dias_sugeridos,
            this.listFiltro.asigna_pm_automatico,
            this.listFiltro.titulo_ord
        );
    }

    // RESETEAR FILTRO A VACIO
    resetFilter(){
        this.titulo_filtro= '';
        this.descripcion_filtro= '';
        this.tipo_tarea_filtro= '';
        this.dias_sugeridos_filtro= '';
        this.es_critica_filtro= '';
        this.ultimo_milestone_filtro= '';
        this.asigna_pm_automatico_filtro= '';
        this.titulo_ord= '';
    }

    // APLICAR FILTRADO
    filter(titulo: string, descripcion: string, tipo_tarea: string, es_critica: string, ultimo_milestone: string, dias_sugeridos: string, asigna_pm_automatico: string, titulo_ord: string){
        this.pagina = -1;
        this.listTareasTemplates = [];
        this.search(titulo, descripcion, tipo_tarea, es_critica, ultimo_milestone, dias_sugeridos, asigna_pm_automatico, titulo_ord);
    }

    // FUNCIONAMIENTO DE BOTON VER MÁS
    search(titulo: string, descripcion: string, tipo_tarea: string, es_critica: string, ultimo_milestone: string, dias_sugeridos: string, asigna_pm_automatico: string, titulo_ord: string){
        this.pagina++;
        var model: any = {
            titulo: titulo,
            descripcion: descripcion,
            tipo_tarea: tipo_tarea,
            es_critica: es_critica,
            ultimo_milestone: ultimo_milestone,
            dias_sugeridos: dias_sugeridos,
            asigna_pm_automatico: asigna_pm_automatico,
            titulo_ord: titulo_ord,
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

    cargarListaTareasTemplate(data: TareaTemplate[]){
        this.transformarHTML(data);
        this.listTareasTemplates = this.listTareasTemplates.concat(data);
    }

    // CONVERTIR A TEXTO PLATO HTML
    transformarHTML(data: TareaTemplate[]){
        let txt = document.createElement("textarea");
        for (let i = 0; i < data.length; i++) {
            let sinTags= data[i].descripcion.replace(/<\/?[^>]+(>|$)/g, "");
            txt.innerHTML = sinTags;
            if (txt.value.length < 60) {
              let valorDescripcion= txt.value.substring(0, 60);
              data[i].descripcionConvertidaHTML= valorDescripcion;
            }else{
              let valorDescripcion= txt.value.substring(0, 60)+"...";
              data[i].descripcionConvertidaHTML= valorDescripcion;
            }
        }
    }

    // ABRIR MODAL DE CREACION
    showModalCrear():void {
        this.modalCrear.show();
    }

    // CERRAR MODAL DE CREACION
    hideModalCrear():void {
        this.modalCrear.hide();
        this.isSubmitTareaTemplate= false;
        this.resetCreateForm();
    }

    //RESETEAR FORMULARIO CREACION
    resetCreateForm(){
      this.formCreacion.reset({
          titulo: '',
          descripcion: '',
          id_tipo_tarea: 1,
          es_critica: '',
          ultimo_milestone: '',
          dias_sugeridos: '',
          asigna_pm_automatico: '',
      })
    }

    // POST TAREA TEMPLATE
    create() {
        this.isSubmitTareaTemplate= true;
        if(this.formCreacion.valid && this.isSubmitTareaTemplate){
            var model: any = {
                titulo: this.formCreacion.get('titulo').value.trim(),
                descripcion: this.formCreacion.get('descripcion').value.trim(),
                id_tipo_tarea: this.formCreacion.get('id_tipo_tarea').value,
                es_critica: this.formCreacion.get('es_critica').value,
                ultimo_milestone: this.formCreacion.get('ultimo_milestone').value,
                dias_sugeridos: this.formCreacion.get('dias_sugeridos').value,
                asigna_pm_automatico: this.formCreacion.get('asigna_pm_automatico').value,
            }
            this.loader= true;
            this.servicio.create(model)
            .subscribe(
                data => {
                    this.hideModalCrear();
                    this.loadFilter();
                    this.toastyService.success("La tarea template fue creada exitosamente");
                    this.loader= false;
                    this.isSubmitTareaTemplate= false;
                    this.resetCreateForm();
                },
                error => {
                    this.alert_server.messageError(error);
                    this.loader= false;
                    this.isSubmitTareaTemplate= false;
                }
            );
        }else{
            // VALIDACION ANTES DE POST
            this.formCreacion= this.fb.group({
                titulo: [this.formCreacion.get('titulo').value, Validators.compose([
                    Validators.required,
                    Validators.maxLength(50),
                    Validaciones.verificarEspacios,
                ])],
                descripcion: [this.formCreacion.get('descripcion').value, Validators.compose([
                    Validators.required,
                    Validaciones.verificarEspacios,
                ])],
                id_tipo_tarea: [this.formCreacion.get('id_tipo_tarea').value, Validators.compose([
                    Validators.required,
                ])],
                es_critica: [this.formCreacion.get('es_critica').value, Validators.compose([
                    Validators.required,
                ])],
                ultimo_milestone: [this.formCreacion.get('ultimo_milestone').value, Validators.compose([
                    Validators.required,
                ])],
                dias_sugeridos: [this.formCreacion.get('dias_sugeridos').value, Validators.compose([
                    Validators.required,
                    Validators.pattern(/^(?:36[0-5]|3[0-5][0-9]|[12][0-9][0-9]|[1-9][0-9]|[1-9])$/im),
                ])],
                asigna_pm_automatico: [this.formCreacion.get('asigna_pm_automatico').value, Validators.compose([
                    Validators.required,
                ])],
            })
        }
    }

    // RECIBIR FILA DE TAREAS Y MOSTRAR EN FORMULARIO DE EDICION
    showModalEditar(tareas: TareaTemplate, index: number){
        this.modalEditar.show();
        this.editTareasTemplates= tareas;
        this.posicionList= index;
        this.verificarDescripcion= tareas.descripcion;

        this.formEdicion= this.fb.group({
            titulo2: [tareas.titulo, Validators.compose([
                Validators.required,
                Validators.maxLength(50),
                Validaciones.verificarEspacios,
            ])],
            descripcion2: [tareas.descripcion, Validators.compose([
                Validators.required,
            ])],
            id_tipo_tarea2: [tareas.id_tipo_tarea, Validators.compose([
                Validators.required,
            ])],
            es_critica2: [tareas.es_critica, Validators.compose([
                Validators.required,
            ])],
            ultimo_milestone2: [tareas.ultimo_milestone, Validators.compose([
                Validators.required,
            ])],
            dias_sugeridos2: [tareas.dias_sugeridos, Validators.compose([
                Validators.required,
                Validators.pattern(/^(?:36[0-5]|3[0-5][0-9]|[12][0-9][0-9]|[1-9][0-9]|[1-9])$/im),
            ])],
            asigna_pm_automatico2: [tareas.asigna_pm_automatico, Validators.compose([
                Validators.required,
            ])]
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
            this.isSubmitTareaTemplate= false;
            this.verValidacion= false;
            this.resetEditForm();
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
        this.isSubmitTareaTemplate= false;
        this.verValidacion= false;
        this.resetEditForm();
    }

    //RESETEAR FORMULARIO CREACION
    resetEditForm(){
      this.formEdicion.reset({
          titulo2: '',
          descripcion2: '',
          id_tipo_tarea2: '',
          es_critica2: '',
          ultimo_milestone2: '',
          dias_sugeridos2: '',
          asigna_pm_automatico2: '',
      })
    }

    // ACTUALIZAR REGISTRO EN LA LISTA
    actualizarListaEdicion(data: TareaTemplate[]){
        this.transformarHTML(data);
        this.listTareasTemplates[this.posicionList]= data[0];
    }

    // PUT TAREAS TEMPLATES
    edit() {
        this.isSubmitTareaTemplate= true;
        if(this.formEdicion.valid && this.isSubmitTareaTemplate) {
            var model: any = {
                id: this.editTareasTemplates.id,
                titulo: this.formEdicion.get('titulo2').value.trim(),
                descripcion: this.formEdicion.get('descripcion2').value.trim(),
                id_tipo_tarea: this.formEdicion.get('id_tipo_tarea2').value,
                es_critica: this.formEdicion.get('es_critica2').value,
                ultimo_milestone: this.formEdicion.get('ultimo_milestone2').value,
                dias_sugeridos: this.formEdicion.get('dias_sugeridos2').value,
                asigna_pm_automatico: this.formEdicion.get('asigna_pm_automatico2').value,
            }
            this.loader= true;
            this.servicio.update(model)
            .subscribe(
                data => {
                    this.modalEditar.hide();
                    this.actualizarListaEdicion(data);
                    this.modificar = false;
                    this.verValidacion= false;
                    this.loader= false;
                    this.toastyService.info("La tarea template fue editada exitosamente");
                    this.isSubmitTareaTemplate= false;
                },
                error => {
                    this.alert_server.messageError(error);
                    this.loader= false;
                    this.isSubmitTareaTemplate= false;
                }
            );
        }else{
            // VALIDAR ANTES DE PUT
            this.verValidacion= true;

            this.formEdicion= this.fb.group({
                titulo2: [this.formEdicion.get('titulo2').value, Validators.compose([
                    Validators.required,
                    Validators.maxLength(50),
                    Validaciones.verificarEspacios,
                ])],
                descripcion2: [this.formEdicion.get('descripcion2').value, Validators.compose([
                    Validators.required,
                    Validaciones.verificarEspacios,
                ])],
                id_tipo_tarea2: [this.formEdicion.get('id_tipo_tarea2').value, Validators.compose([
                    Validators.required,
                ])],
                es_critica2: [this.formEdicion.get('es_critica2').value, Validators.compose([
                    Validators.required,
                ])],
                ultimo_milestone2: [this.formEdicion.get('ultimo_milestone2').value, Validators.compose([
                    Validators.required,
                ])],
                dias_sugeridos2: [this.formEdicion.get('dias_sugeridos2').value, Validators.compose([
                    Validators.required,
                    Validators.pattern(/^(?:36[0-5]|3[0-5][0-9]|[12][0-9][0-9]|[1-9][0-9]|[1-9])$/im),
                ])],
                asigna_pm_automatico2: [this.formEdicion.get('asigna_pm_automatico2').value, Validators.compose([
                    Validators.required,
                ])]
            })
        }
    }

    // RECIBIR FILA DE TAREAS Y MOSTRAR EN FORMULARIO DE ELIMINACION
    onDelete(tareas: TareaTemplate, index: number){
        this.deleteTareasTemplates= tareas;
        this.posicionList= index;
    }

    // DELETE TAREA TEMPLATE
    delete(){
      this.loader= true;
      this.servicio.delete(this.deleteTareasTemplates.id)
      .subscribe(
          data => {
              this.actualizarListaEliminacion();
              $('#eliminar-tarea').modal('hide');
              this.toastyService.error("La tarea template fue eliminada exitosamente");
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
        this.listTareasTemplates.splice(this.posicionList, 1);
    }

    // LIMIAR FILTRO
    cleanFilter(){
        this.resetFilter();
    }

}
