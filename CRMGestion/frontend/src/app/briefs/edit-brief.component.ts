import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AlertServer } from '../global/index';
import { BriefService } from '../services/index';
import { IMyOptions } from 'mydatepicker';
import { FormBuilder, Validators, NgForm, FormGroup } from '@angular/forms';
import { Servicio, Brief, Contacto, EmailContacto, TelefonoContacto, ServicioContratado, RolContacto, TipoTelefono, TipoEmpresa, MetodoFacturacion, TipoVenta, CanalAdquisicion, User } from '../models/index';
import { Validaciones } from '../validaciones/index';
import { ModalDirective } from 'ng2-bootstrap';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

@Component({
    moduleId: module.id,
    selector: 'edit-brief',
    templateUrl: './edit-brief.html',
    providers: [AlertServer]
})

export class EditBriefComponent implements OnInit{
  formBrief: FormGroup;
  selectedId: number;
  selectedName: string;
  dataBrief: any;
  nombreRolContacto: string;
  nombreTipoTelefono: string;
  loader: boolean= false;
  listRolesContacto: RolContacto[]= [];
  listTiposTelefonos: TipoTelefono[]= [];
  listTiposEmpresas: TipoEmpresa[]= [];
  listMetodosFacturacion: MetodoFacturacion[]= [];
  listServiciosContratados: Servicio[]= [];
  listTiposVenta: TipoVenta[]= [];
  listCanalesAdquicision: CanalAdquisicion[]= [];
  listPms: User[]= [];
  fechaComienzoObjeto: Object= {};
  dataTiposVentas: string[]= [];
  dataCanalesAdquisicion: string[]= [];
  idPmAsignado: string = '';
  idMetodoFacturacion: string= '';
  dataTiposEmpresas: string[]= [];
  estadoBrief: string;
  cambioformulario: boolean= false;
  deleteContacto: Contacto;
  posicionEliminarContacto: number;
  deleteServicio: ServicioContratado;
  posicionEliminarServicio: number;
  puntajeCliente: string = '';
  esPrincipal: boolean= true;
  editServicioContratado: ServicioContratado;
  calidadModeloNegocio: string;
  upselibilidad: string;
  educabilidad: string;
  conocimientoInternet: string;
  capacidadFinancieraCliente: string;
  nivelEsperadoHinchapelotes: string;
  estadoGuardado: boolean= true;

  //OPCIONES DE MASK MONEY
  public numberMask = createNumberMask({
    prefix: '',
    suffix: '',
    thousandsSeparatorSymbol: '.'
  })
  public onlyNumberMask = createNumberMask({
    prefix: '',
    suffix: '',
    decimalSymbol: '',
    thousandsSeparatorSymbol: '',
  });

  //CREACION DE CONTACTO
  @ViewChild('modalCreateContacto') public modalCreateContacto:ModalDirective;
  formCreateContacto: FormGroup;
  formCreateEmailContacto: FormGroup;
  formCreateTelefonoContacto: FormGroup;
  formCreateRolContacto: FormGroup;
  modelModalContacto: Contacto;
  modelContacto: Contacto[]= [];
  isSubmitRolContacto: boolean= false;
  isSubmitEmailContacto: boolean = false;
  isSubmitTelefonoContacto: boolean = false;
  isSubmitContacto: boolean = false;

  // EDICION DE CONTACTO
  @ViewChild('modalEditContacto') public modalEditContacto:ModalDirective;
  formEditContacto: FormGroup;
  formEditEmailContacto: FormGroup;
  formEditTelefonoContacto: FormGroup;
  formEditRolContacto: FormGroup;
  indexModalEdicionContacto: number;

  // CREACION DE SERVICION
  @ViewChild('modalCreateServicio') public modalCreateServicio:ModalDirective;
  formCreateServicio: FormGroup;
  modelServicioContratado: ServicioContratado[]= [];
  isSubmitServicio: boolean = false;
  nombreServicioContratado: string;
  servicioRecurrente: boolean;

  //EDICION DE SERVICIO
  @ViewChild('modalEditServicio') public modalEditServicio:ModalDirective;
  formEditServicio: FormGroup;
  indexModalEdicionServicio: number;
  servicioRecurrenteEdit: boolean;

  constructor(
    private route: ActivatedRoute,
    private servicio: BriefService,
    private fb: FormBuilder,
    private toastyService:ToastyService,
    private toastyConfig: ToastyConfig,
    private alert_server: AlertServer,
    private router: Router,
  ){

    // OPCIONES PREDETERMINADAS TASTY
    this.toastyConfig.theme = 'bootstrap';
    this.toastyConfig.timeout = 5000;
    this.toastyConfig.showClose = true;

    // CAPTURAR ID Y NOMBRE DE LISTADO DE BRIEFS SELECCIONADO
    this.selectedId = +this.route.snapshot.params['id'];
    this.selectedName = this.route.snapshot.params['name'];
    this.servicio.getBrief(this.selectedId).subscribe(
      data => {
        this.dataBrief = this.cargarDatosBrief(data.brief);
        if (this.dataBrief) {

          this.cargarDatosTiposVentas(data.tiposVentas);
          this.cargarDatosTiposEmpresas(data.tiposEmpresas);
          this.cargarDatosCanalesAdquisicion(data.canalesAdquisicion);
          this.cargarDatosContactos(data.contactos, data.emailsContactos, data.telefonosContactos, data.rolesContactos);
          this.cargarDatosServicios(data.servicios);

          // FORMULARIO DE BRIEF
          this.createBriefForm();

        }
      },
      error => {
        this.alert_server.messageError(error);
      }
    );

    // INSTANCIAR FORMULARIOS
    this.createContactoForm();
    this.createServicioForm();

  }

  // INICIAR
  ngOnInit(){
    this.loadPm();
    this.loadRolesContactos();
    this.loadTiposTelefonos();
    this.loadTiposEmpresas();
    this.loadServiciosContratados();
    this.loadMetodosFacturacion();
    this.loadTiposVentas();
    this.loadCanalesAdquisicion();
  }

  // CARGA DE DATOS DE BRIEF Y RETORNARLOS AL SUBSCRIBE
  cargarDatosBrief(data: any){
    for (let select of data){

      // TRANSFORMAR FECHA EN OBJETO PARA MOSTRAT EN DATEPICKER
      if (select.fecha_comienzo) {
        let fechaModel= new Date(select.fecha_comienzo);
        this.fechaComienzoObjeto = { date: { year: fechaModel.getUTCFullYear(), month: fechaModel.getUTCMonth() + 1, day: fechaModel.getUTCDate() } };
      }else{
        this.fechaComienzoObjeto= null;
      }

      // VERIFICAR PM ASIGNADO
      if (select.id_pm) {
        this.idPmAsignado= select.id_pm.toString();
      }else{
        this.idPmAsignado= '';
      }

      // VERIFICAR METODO FACTURACION
      if (select.id_metodo_facturacion) {
        this.idMetodoFacturacion= select.id_metodo_facturacion.toString();
      }else{
        this.idMetodoFacturacion= '';
      }

      // VERIFICAR PUNTAJE CLIENTE
      if (select.puntaje_cliente) {
        this.puntajeCliente= select.puntaje_cliente.toString();
      }else{
        this.puntajeCliente= '';
      }

      // VERIFICAR CALIDAD DE MODELO DE NEGOCIO
      if (select.calidad_modelo_negocio) {
        this.calidadModeloNegocio= select.calidad_modelo_negocio.toString();
      }else{
        this.calidadModeloNegocio= '';
      }

      // VERIFICAR UPSELIBILIDAD
      if (select.upselibilidad) {
        this.upselibilidad= select.upselibilidad.toString();
      }else{
        this.upselibilidad= '';
      }

      // VERIFICAR EDUCABILIDAD
      if (select.educabilidad) {
        this.educabilidad= select.educabilidad.toString();
      }else{
        this.educabilidad= '';
      }

      // VERIFICAR NIVEL CONOCIMIENTO DE INTERNET
      if (select.conocimiento_internet) {
        this.conocimientoInternet= select.conocimiento_internet.toString();
      }else{
        this.conocimientoInternet= '';
      }

      // VERIFICAR CAPACIDAD FINANCIERA DE INTERNET
      if (select.capacidad_financiera_cliente) {
        this.capacidadFinancieraCliente= select.capacidad_financiera_cliente.toString();
      }else{
        this.capacidadFinancieraCliente= '';
      }

      // VERIFICAR NIVEL ESPERADO HINCHAPELOTES
      if (select.nivel_esperado_hinchapelotes) {
        this.nivelEsperadoHinchapelotes= select.nivel_esperado_hinchapelotes.toString();
      }else{
        this.nivelEsperadoHinchapelotes= '';
      }

      this.estadoBrief= select.estado;

      return select;
    }
  }

  //CARGAR DATOS DE TIPOS DE EMPRESAS
  cargarDatosTiposEmpresas(data: TipoEmpresa[]){
    for (let select of data) {
      // ["3","4"]
      let toString= select.id.toString();
      this.dataTiposEmpresas.push(toString);
    }
  }

  //CARGAR DATOS DE TIPOS DE VENTAS
  cargarDatosTiposVentas(data: TipoVenta[]){
    for (let select of data) {
      // ["3","4"]
      let toString= select.id.toString();
      this.dataTiposVentas.push(toString);
    }
  }

  //CARGAR DATOS DE CANAL DE ADQUISICION
  cargarDatosCanalesAdquisicion(data: CanalAdquisicion[]){
    for (let select of data) {
      // ["3","4"]
      let toString= select.id.toString();
      this.dataCanalesAdquisicion.push(toString);
    }
  }

  // CARGAR DATOS DE CONTACTO
  cargarDatosContactos(contacto: Contacto[], emails: EmailContacto[], telefonos: TelefonoContacto[], roles: RolContacto[]){
    for (let selectContacto of contacto) {
      this.modelModalContacto=new Contacto();
      this.modelModalContacto.id= selectContacto.id;
      this.modelModalContacto.nombre= selectContacto.nombre;
      this.modelModalContacto.apellido= selectContacto.apellido;
      this.modelModalContacto.religion_judia= selectContacto.religion_judia;
      this.modelModalContacto.medio_contacto= selectContacto.medio_contacto;
      this.modelModalContacto.comentario_contacto= selectContacto.comentarios;
      this.modelModalContacto.es_principal= selectContacto.es_principal;
      this.modelModalContacto.eliminado= selectContacto.eliminado;

      for (let selectRol of roles) {
        if (selectRol.id_contacto == this.modelModalContacto.id) {
          let model: any = {
            rol_contacto: selectRol.id,
            nombre_rol: selectRol.nombre,
          };
          this.modelModalContacto.roles.push(model);
        }
      }

      for (let selectEmail of emails) {
        if (selectEmail.id_contacto == this.modelModalContacto.id) {
          let model: any = {
            email: selectEmail.email,
          };
          this.modelModalContacto.emails.push(model);
        }
      }

      for (let selectTelefono of telefonos) {
        if (selectTelefono.id_contacto == this.modelModalContacto.id) {
          let model: any = {
            tipo_telefono: selectTelefono.id_tipo_telefono,
            telefono: selectTelefono.telefono,
            nombre_tipo_telefono: selectTelefono.nombre_tipo_telefono,
          };
          this.modelModalContacto.telefonos.push(model);
        }
      }
      this.modelContacto.push(this.modelModalContacto);
    }

    var arrayVerificar: boolean[]= [];
    for (let verificar of this.modelContacto) {
      if (verificar.es_principal == true) {
        arrayVerificar.push(verificar.es_principal);
      }
    }

    if(arrayVerificar.length < 1){
      this.esPrincipal= false;
    }else{
      this.esPrincipal= true;
    }

  }

  // CARGAR DATOS DEL SERVICIOS
  cargarDatosServicios(data: ServicioContratado[]){
    for (let select of data) {
        this.modelServicioContratado.push(select);
    }
  }

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

  // CREAR FORMULARIO DE BRIEF
  createBriefForm(){
    this.formBrief= this.fb.group({
      nombre: [this.dataBrief.nombre, Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          Validaciones.verificarEspacios,
      ])],
      pm_asignado: [this.idPmAsignado, Validators.compose([
          Validators.required,
      ])],
      fecha_comienzo: [this.fechaComienzoObjeto, Validators.compose([
          Validators.required,
      ])],
      propuesta_original: [this.dataBrief.propuesta_original, Validators.compose([
          Validators.required,
      ])],
      monto_abono: [this.dataBrief.monto_abono, Validators.compose([
          Validators.required,
      ])],
      presupuesto_invertir_publicidad: [this.dataBrief.presupuesto_invertir_publicidad, Validators.compose([
          Validators.required,
      ])],
      distribucion_presupuesto_publicidad: this.dataBrief.distribucion_presupuesto_publicidad,
      id_metodo_facturacion: [this.idMetodoFacturacion, Validators.compose([
          Validators.required,
      ])],
      sitio_web: [this.dataBrief.sitio_web, Validators.compose([
          Validators.maxLength(80),
      ])],
      fan_page: [this.dataBrief.fan_page, Validators.compose([
          Validators.maxLength(80),
      ])],
      id_tipo_empresa: [this.dataTiposEmpresas, Validators.compose([
          Validators.required,
      ])],
      rubro: [this.dataBrief.rubro, Validators.compose([
          Validators.required,
      ])],
      id_tipo_venta: [this.dataTiposVentas, Validators.compose([
          Validators.required,
      ])],
      modelo_negocio: [this.dataBrief.modelo_negocio, Validators.compose([
          Validators.required,
      ])],
      calidad_modelo_negocio: [this.calidadModeloNegocio, Validators.compose([
          Validators.required,
      ])],
      acciones_realiza_internet: [this.dataBrief.acciones_realiza_internet, Validators.compose([
          Validators.required,
      ])],
      upselibilidad: [this.upselibilidad, Validators.compose([
          Validators.required,
      ])],
      comentario_upselibilidad: [this.dataBrief.comentario_upselibilidad, Validators.compose([
          Validators.required,
      ])],
      educabilidad: [this.educabilidad, Validators.compose([
          Validators.required,
      ])],
      comentario_educabilidad: [this.dataBrief.comentario_educabilidad, Validators.compose([
          Validators.required,
      ])],
      id_canal_adquisicion: [this.dataCanalesAdquisicion, Validators.compose([
          Validators.required,
      ])],
      comentario_adquisicion: [this.dataBrief.comentario_adquisicion, Validators.compose([
          Validators.required,
      ])],
      conocimiento_internet: [this.conocimientoInternet, Validators.compose([
          Validators.required,
      ])],
      capacidad_financiera_cliente: [this.capacidadFinancieraCliente, Validators.compose([
          Validators.required,
      ])],
      nivel_esperado_hinchapelotes: [this.nivelEsperadoHinchapelotes, Validators.compose([
          Validators.required,
      ])],
      puntaje_cliente: [this.puntajeCliente, Validators.compose([
          Validators.required,
          Validators.pattern(/^(?:10|[1-9])$/m),
      ])],
      competidores_cliente: [this.dataBrief.competidores_cliente, Validators.compose([
          Validators.required,
      ])],
      personalidad: [this.dataBrief.personalidad, Validators.compose([
          Validators.required,
      ])],
      porque_llego: [this.dataBrief.porque_llego, Validators.compose([
          Validators.required,
      ])],
      servicio_buscado: [this.dataBrief.servicio_buscado, Validators.compose([
          Validators.required,
      ])],
      estado: [this.dataBrief.estado, Validators.compose([
          Validators.required,
      ])],
    })
  }

  // CARGAR LISTADO DE ROLES
  loadPm(){
    this.servicio.getListadoPms().subscribe(
      list => { this.listPms = list; },
      error => {
        this.alert_server.messageError(error);
      }
    );
  }

  // CARGAR LISTADO DE ROLES
  loadRolesContactos(){
    this.servicio.getListadoRolesContactos().subscribe(
      list => { this.listRolesContacto = list; },
      error => {
        this.alert_server.messageError(error);
      }
    );
  }

  // CARGAR LISTADO DE TIPOS DE TELEFONOS
  loadTiposTelefonos(){
    this.servicio.getListadoTiposTelefonos().subscribe(
      list => { this.listTiposTelefonos = list; },
      error => {
        this.alert_server.messageError(error);
      }
    );
  }

  // CARGAR LISTADO DE TIPOS DE EMPRESA
  loadTiposEmpresas(){
    this.servicio.getListadoTiposEmpresas().subscribe(
      list => { this.listTiposEmpresas = list; },
      error => {
        this.alert_server.messageError(error);
      }
    );
  }

  // CARGAR LISTADO DE METODOS DE FATURACION
  loadMetodosFacturacion(){
    this.servicio.getListadoMetodosFacturacion().subscribe(
      list => { this.listMetodosFacturacion = list; },
      error => {
        this.alert_server.messageError(error);
      }
    );
  }

  // CARGAR LISTADO DE METODOS DE FATURACION
  loadTiposVentas(){
    this.servicio.getListadoTiposVentas().subscribe(
      list => { this.listTiposVenta = list; },
      error => {
        this.alert_server.messageError(error);
      }
    );
  }

  // CARGAR LISTADO DE CANALES DE ADQUISICION
  loadCanalesAdquisicion(){
    this.servicio.getListadoCanalesAdquisicion().subscribe(
      list => { this.listCanalesAdquicision = list; },
      error => {
        this.alert_server.messageError(error);
      }
    );
  }

  // CREAR FORMULARIO DE CONTACTO
  createContactoForm(){
    this.formCreateContacto= this.fb.group({
      nombre_contacto: ['', Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          Validaciones.verificarEspacios,
      ])],
      apellido_contacto: '',
      religion_judia: 0,
      medio_contacto: ['', Validators.compose([
          Validators.required,
          Validaciones.verificarEspacios,
      ])],
      comentarios_contactos: '',
      es_principal: 0,
    })

    this.formCreateRolContacto= this.fb.group({
      rol_contacto: ['', Validators.compose([
          Validators.required,
      ])],
    })

    this.formCreateEmailContacto= this.fb.group({
      email_contacto: ['', Validators.compose([
          Validators.required,
          Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/im)
      ])],
    })

    this.formCreateTelefonoContacto= this.fb.group({
      tipo_telefono: ['', Validators.compose([
          Validators.required,
      ])],
      telefono_contacto: ['', Validators.compose([
          Validators.required,
      ])],
    })
  }

  // CREAR FORMULARIO DE SERVICIO
  createServicioForm(){
    this.formCreateServicio= this.fb.group({
      id_servicio: ['', Validators.compose([
          Validators.required,
      ])],
      cantidad_mensual: ['', Validators.compose([
          Validators.required,
      ])],
    })
  }

  // CAPTURAR ROL EN EVENTO CHANGE
  capturarRolContacto(event: any){
    this.nombreRolContacto= event.target.selectedOptions[0].innerHTML;
  }

  // CAPTURAR TIPO DE TELEFONO
  capturarTipoTelefono(event: any){
    this.nombreTipoTelefono= event.target.selectedOptions[0].innerHTML;
  }

  // ABRIR MODAL DE CREACION CONTACTO
  showModalCreateContacto():void {
      this.modelModalContacto=new Contacto();
      this.modalCreateContacto.show();
      this.createContactoForm();
  }

  // CERRAR MODAL DE CREACION DE CONTACTO
  hideModalCreateContacto():void {
    this.modalCreateContacto.hide();
    this.isSubmitContacto= false;
    this.isSubmitRolContacto= false;
    this.isSubmitEmailContacto= false;
    this.isSubmitTelefonoContacto= false;
    this.modelModalContacto=null;
    this.formCreateContacto.reset({
      nombre_contacto: '',
      apellido_contacto: '',
      religion_judia: 0,
      medio_contacto: '',
      comentarios_contactos: '',
      es_principal: 0,
    });
    this.formCreateRolContacto.reset({
      rol_contacto: '',
    });
    this.formCreateEmailContacto.reset({
      email_contacto: '',
    });
    this.formCreateTelefonoContacto.reset({
      tipo_telefono: '',
      telefono_contacto: '',
    });
  }

  // AGREGAR ROLES DE CONTACTOS
  addRolesModalCreateContacto(){
    this.isSubmitRolContacto= true;
    if (this.formCreateRolContacto.valid && this.isSubmitRolContacto) {
      let model: any = {
        rol_contacto: this.formCreateRolContacto.get('rol_contacto').value,
        nombre_rol: this.nombreRolContacto,
      };
      this.modelModalContacto.roles.push(model);
      this.isSubmitRolContacto= false;
      this.formCreateRolContacto.reset({
        rol_contacto: '',
      });
    }else{
      this.formCreateRolContacto= this.fb.group({
        rol_contacto: [this.formCreateRolContacto.get('rol_contacto').value, Validators.compose([
            Validators.required,
        ])],
      })
    }
  }

  // ELIMINAR ROLES DE CONTACTOS
  deleteRolesModalCreateContacto(index: number){
    this.modelModalContacto.roles.splice(index, 1);
  }

  // AGREGAR EMAILS DE CONTACTOS
  addEmailModalCreateContacto(){
    this.isSubmitEmailContacto= true;
    if (this.formCreateEmailContacto.valid && this.isSubmitEmailContacto) {
      let model: any = {
        email: this.formCreateEmailContacto.get('email_contacto').value,
      };
      this.modelModalContacto.emails.push(model);
      this.isSubmitEmailContacto= false;
      this.formCreateEmailContacto.reset({
        email_contacto: '',
      });
    }else{
      this.formCreateEmailContacto= this.fb.group({
        email_contacto: [this.formCreateEmailContacto.get('email_contacto').value, Validators.compose([
            Validators.required,
            Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/im)
        ])],
      })
    }
  }

  // EDITAR EMAILS DE CONTACTOS
  // editEmailModalCreateContacto(event:any, columna:string, index:number){
  //   if(columna == 'email'){
  //
  //     let newContent: string = event.target.innerHTML.trim();
  //     if (newContent.length < 1) {
  //       this.toastyService.error("El email es requerido");
  //     }else{
  //       this.modelModalContacto.emails[index].email = newContent;
  //     }
  //
  //   }
  // }

  // ELIMINAR EMAILS DE CONTACTOS
  deleteEmailModalCreateContacto(index: number){
    this.modelModalContacto.emails.splice(index, 1);
  }

  // AGREGAR TELEFONOS DE CONTACTOS
  addTelefonoModalCreateContacto(){
    this.isSubmitTelefonoContacto= true;
    if (this.formCreateTelefonoContacto.valid && this.isSubmitTelefonoContacto) {
      let model: any = {
        tipo_telefono: this.formCreateTelefonoContacto.get('tipo_telefono').value,
        telefono: this.formCreateTelefonoContacto.get('telefono_contacto').value,
        nombre_tipo_telefono: this.nombreTipoTelefono,
      };
      this.modelModalContacto.telefonos.push(model);
      this.isSubmitTelefonoContacto= false;
      this.formCreateTelefonoContacto.reset({
        tipo_telefono: '',
        telefono_contacto: '',
      });
    }else{
      this.formCreateTelefonoContacto= this.fb.group({
        tipo_telefono: [this.formCreateTelefonoContacto.get('tipo_telefono').value, Validators.compose([
            Validators.required,
        ])],
        telefono_contacto: [this.formCreateTelefonoContacto.get('telefono_contacto').value, Validators.compose([
            Validators.required,
        ])],
      })
    }
  }

  // EDITAR EMAILS DE CONTACTOS
  // editTelefonoModalCreateContacto(event:any, columna:string, index:number){
  //
  //   if(columna == 'telefono'){
  //
  //     let newContent: string = event.target.innerHTML.trim();
  //     if (newContent.length < 1) {
  //       this.toastyService.error("El teléfono es requerido");
  //     }else{
  //       this.modelModalContacto.telefonos[index].telefono = newContent;
  //     }
  //
  //   }
  //
  // }

  // ELIMINAR EMAILS DE CONTACTOS
  deleteTelefonoModalCreateContacto(index: number){
    this.modelModalContacto.telefonos.splice(index, 1);
  }

  // CREAR CONTACTOS
  createContacto(){
    this.isSubmitContacto= true;

    if (this.modelModalContacto.roles.length < 1) {

      this.toastyService.error("Debe asignar al menos un rol al contacto");

    } else if(this.modelModalContacto.emails.length < 1){

      this.toastyService.error("Debe asignar al menos un email al contacto");

    }else if(this.modelModalContacto.telefonos.length < 1){

      this.toastyService.error("Debe asignar al menos un teléfono al contacto");

    }else{

      if (this.formCreateContacto.valid && this.isSubmitContacto) {
        let model : any = {
          nombre: this.formCreateContacto.get('nombre_contacto').value,
          apellido: this.formCreateContacto.get('apellido_contacto').value,
          nombre_rol: this.nombreRolContacto,
          religion_judia: this.formCreateContacto.get('religion_judia').value,
          medio_contacto: this.formCreateContacto.get('medio_contacto').value,
          comentarios_contactos: this.formCreateContacto.get('comentarios_contactos').value,
          es_principal: this.formCreateContacto.get('es_principal').value,
        }
        this.modelModalContacto.nombre= model.nombre;
        this.modelModalContacto.apellido= model.apellido;
        this.modelModalContacto.religion_judia= model.religion_judia;
        this.modelModalContacto.medio_contacto= model.medio_contacto;
        this.modelModalContacto.comentario_contacto= model.comentarios_contactos;
        this.modelModalContacto.es_principal= model.es_principal;
        var iArray= this.modelContacto.push(this.modelModalContacto);
        let arrayContactoConvert= JSON.stringify(this.modelContacto[iArray-1]);
        let modelArray: any = {
          arrayContacto: arrayContactoConvert,
          id_brief: this.selectedId,
        }
        this.loader = true;
        this.servicio.addContacto(modelArray)
        .subscribe(
            data => {
              this.isSubmitContacto= false;
              this.formCreateContacto.reset({
                nombre_contacto: '',
                apellido_contacto: '',
                religion_judia: 0,
                medio_contacto: '',
                comentarios_contactos: '',
                es_principal: 0,
              });
              this.formCreateRolContacto.reset({
                rol_contacto: '',
              });
              this.formCreateEmailContacto.reset({
                email_contacto: '',
              });
              this.formCreateTelefonoContacto.reset({
                tipo_telefono: '',
                telefono_contacto: '',
              });
              this.modelContacto= [];
              this.cargarDatosContactos(data.contactos, data.emailsContactos, data.telefonosContactos, data.rolesContactos);
              this.toastyService.success("El contacto fue creado exitosamente");
              this.loader = false;
              this.modalCreateContacto.hide();
            },
            error => {
              this.modelContacto.pop();
              this.alert_server.messageError(error);
              this.loader = false;
            }
        );
      }else{
        this.formCreateContacto= this.fb.group({
          nombre_contacto: [this.formCreateContacto.get('nombre_contacto').value, Validators.compose([
              Validators.required,
              Validators.maxLength(50),
              Validaciones.verificarEspacios,
          ])],
          apellido_contacto: this.formCreateContacto.get('apellido_contacto').value,
          religion_judia: this.formCreateContacto.get('religion_judia').value,
          medio_contacto: [this.formCreateContacto.get('medio_contacto').value, Validators.compose([
              Validators.required,
              Validaciones.verificarEspacios,
          ])],
          comentarios_contactos: this.formCreateContacto.get('comentarios_contactos').value,
          es_principal: this.formCreateContacto.get('es_principal').value,
        })
      }
    }
  }

  // EDICION DE CONTACTOS
  // ABRIR MODAL DE EDICION CONTACTO
  showModalEditContacto(index: number):void {
      this.modalEditContacto.show();
      this.indexModalEdicionContacto= index;
      this.formEditContacto= this.fb.group({
        nombre_contacto: [this.modelContacto[this.indexModalEdicionContacto].nombre, Validators.compose([
            Validators.required,
            Validators.maxLength(50),
            Validaciones.verificarEspacios,
        ])],
        apellido_contacto: this.modelContacto[this.indexModalEdicionContacto].apellido,
        religion_judia: this.modelContacto[this.indexModalEdicionContacto].religion_judia,
        medio_contacto: [this.modelContacto[this.indexModalEdicionContacto].medio_contacto, Validators.compose([
            Validators.required,
            Validaciones.verificarEspacios,
        ])],
        comentarios_contactos: this.modelContacto[this.indexModalEdicionContacto].comentario_contacto,
        es_principal: this.modelContacto[this.indexModalEdicionContacto].es_principal,
      })

      this.formEditRolContacto= this.fb.group({
        rol_contacto: ['', Validators.compose([
            Validators.required,
        ])],
      })

      this.formEditEmailContacto= this.fb.group({
        email_contacto: ['', Validators.compose([
            Validators.required,
            Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/im)
        ])],
      })

      this.formEditTelefonoContacto= this.fb.group({
        tipo_telefono: ['', Validators.compose([
            Validators.required,
        ])],
        telefono_contacto: ['', Validators.compose([
            Validators.required,
        ])],
      })
  }

  // CERRAR MODAL DE EDICION DE CONTACTO
  hideModalEditContacto():void {
    this.modalEditContacto.hide();
    this.isSubmitContacto= false;
    this.isSubmitRolContacto= false;
    this.isSubmitEmailContacto= false;
    this.isSubmitTelefonoContacto= false;
    this.formEditContacto.reset({
      nombre_contacto: '',
      apellido_contacto: '',
      religion_judia: 0,
      medio_contacto: '',
      comentarios_contactos: '',
      es_principal: 0,
    });
    this.formEditRolContacto.reset({
      rol_contacto: '',
    });
    this.formEditEmailContacto.reset({
      email_contacto: '',
    });
    this.formEditTelefonoContacto.reset({
      tipo_telefono: '',
      telefono_contacto: '',
    });
  }

  // AGREGAR ROLES DE CONTACTOS
  addRolesModalEditContacto(){
    this.isSubmitRolContacto= true;
    if (this.formEditRolContacto.valid && this.isSubmitRolContacto) {
      let model: any = {
        rol_contacto: this.formEditRolContacto.get('rol_contacto').value,
        nombre_rol: this.nombreRolContacto,
      };
      this.modelContacto[this.indexModalEdicionContacto].roles.push(model);
      this.isSubmitRolContacto= false;
      this.formEditRolContacto.reset({
        rol_contacto: '',
      });
    }else{
      this.formEditRolContacto= this.fb.group({
        rol_contacto: [this.formEditRolContacto.get('rol_contacto').value, Validators.compose([
            Validators.required,
        ])],
      })
    }
  }

  // ELIMINAR ROLES DE CONTACTOS
  deleteRolesModalEditContacto(index: number){
    this.modelContacto[this.indexModalEdicionContacto].roles.splice(index, 1);
  }

  // AGREGAR EMAILS DE CONTACTOS
  addEmailModalEditContacto(){
    this.isSubmitEmailContacto= true;
    if (this.formEditEmailContacto.valid && this.isSubmitEmailContacto) {
      let model: any = {
        email: this.formEditEmailContacto.get('email_contacto').value,
      };
      this.modelContacto[this.indexModalEdicionContacto].emails.push(model);
      this.isSubmitEmailContacto= false;
      this.formEditEmailContacto.reset({
        email_contacto: '',
      });
    }else{
      this.formEditEmailContacto= this.fb.group({
        email_contacto: [this.formEditEmailContacto.get('email_contacto').value, Validators.compose([
            Validators.required,
            Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/im)
        ])],
      })
    }
  }

  // EDITAR EMAILS DE CONTACTOS
  // editEmailModalEditContacto(event:any, columna:string, index:number){
  //   if(columna == 'email'){
  //
  //     let newContent: string = event.target.innerHTML.trim();
  //     if (newContent.length < 1) {
  //       this.toastyService.error("El email es requerido");
  //     }else{
  //       this.modelContacto[this.indexModalEdicionContacto].emails[index].email = newContent;
  //     }
  //
  //   }
  // }

  // ELIMINAR EMAILS DE CONTACTOS
  deleteEmailModalEditContacto(index: number){
    this.modelContacto[this.indexModalEdicionContacto].emails.splice(index, 1);
  }

  // AGREGAR TELEFONOS DE CONTACTOS
  addTelefonoModalEditContacto(){
    this.isSubmitTelefonoContacto= true;
    if (this.formEditTelefonoContacto.valid && this.isSubmitTelefonoContacto) {
      let model: any = {
        tipo_telefono: this.formEditTelefonoContacto.get('tipo_telefono').value,
        telefono: this.formEditTelefonoContacto.get('telefono_contacto').value,
        nombre_tipo_telefono: this.nombreTipoTelefono,
      };
      this.modelContacto[this.indexModalEdicionContacto].telefonos.push(model);
      this.isSubmitTelefonoContacto= false;
      this.formEditTelefonoContacto.reset({
        tipo_telefono: '',
        telefono_contacto: '',
      });
    }else{
      this.formEditTelefonoContacto= this.fb.group({
        tipo_telefono: [this.formEditTelefonoContacto.get('descripcion_telefono').value, Validators.compose([
            Validators.required,
        ])],
        telefono_contacto: [this.formEditTelefonoContacto.get('telefono_contacto').value, Validators.compose([
            Validators.required,
        ])],
      })
    }
  }

  // EDITAR EMAILS DE CONTACTOS
  // editTelefonoModalEditContacto(event:any, columna:string, index:number){
  //
  //   if(columna == 'telefono'){
  //
  //     let newContent: string = event.target.innerHTML.trim();
  //     if (newContent.length < 1) {
  //       this.toastyService.error("El teléfono es requerido");
  //     }else{
  //       this.modelContacto[this.indexModalEdicionContacto].telefonos[index].telefono = newContent;
  //     }
  //
  //   }
  //
  // }

  // ELIMINAR EMAILS DE CONTACTOS
  deleteTelefonoModalEditContacto(index: number){
    this.modelContacto[this.indexModalEdicionContacto].telefonos.splice(index, 1);
  }

  //  EDITAR CONTACTO
  editContacto(){
    this.isSubmitContacto= true;
    if (this.modelContacto[this.indexModalEdicionContacto].roles.length < 1) {

      this.toastyService.error("Debe asignar al menos un rol al contacto");

    }else if (this.modelContacto[this.indexModalEdicionContacto].emails.length < 1) {

      this.toastyService.error("Debe asignar al menos un email al contacto");

    } else if(this.modelContacto[this.indexModalEdicionContacto].telefonos.length < 1){

      this.toastyService.error("Debe asignar al menos un teléfono al contacto");

    }else{

      if (this.formEditContacto.valid && this.isSubmitContacto) {
        let model : any = {
          nombre: this.formEditContacto.get('nombre_contacto').value,
          apellido: this.formEditContacto.get('apellido_contacto').value,
          nombre_rol: this.nombreRolContacto,
          religion_judia: this.formEditContacto.get('religion_judia').value,
          medio_contacto: this.formEditContacto.get('medio_contacto').value,
          comentarios_contactos: this.formEditContacto.get('comentarios_contactos').value,
          es_principal: this.formEditContacto.get('es_principal').value,
        }
        this.modelContacto[this.indexModalEdicionContacto].nombre= model.nombre;
        this.modelContacto[this.indexModalEdicionContacto].apellido= model.apellido;
        this.modelContacto[this.indexModalEdicionContacto].nombre_rol= model.nombre_rol;
        this.modelContacto[this.indexModalEdicionContacto].religion_judia= model.religion_judia;
        this.modelContacto[this.indexModalEdicionContacto].medio_contacto= model.medio_contacto;
        this.modelContacto[this.indexModalEdicionContacto].comentario_contacto= model.comentarios_contactos;
        this.modelContacto[this.indexModalEdicionContacto].es_principal= model.es_principal;
        let arrayContactoConvert= JSON.stringify(this.modelContacto[this.indexModalEdicionContacto]);
        let modelArray: any = {
          arrayContacto: arrayContactoConvert,
        }
        this.loader = true;
        this.servicio.editContacto(modelArray, this.selectedId)
        .subscribe(
            data => {
              this.isSubmitContacto= false;
              this.formEditContacto.reset({
                nombre_contacto: '',
                apellido_contacto: '',
                religion_judia: 0,
                medio_contacto: '',
                comentarios_contactos: '',
                es_principal: 0,
              });
              this.formEditRolContacto.reset({
                rol_contacto: '',
              });
              this.formEditEmailContacto.reset({
                email_contacto: '',
              });
              this.formEditTelefonoContacto.reset({
                tipo_telefono: '',
                telefono_contacto: '',
              });
              this.modelContacto= [];
              this.cargarDatosContactos(data.contactos, data.emailsContactos, data.telefonosContactos, data.rolesContactos);
              this.toastyService.info("El contacto fue editado exitosamente");
              this.loader = false;
              this.modalEditContacto.hide();
            },
            error => {
              this.modelContacto.pop();
              this.alert_server.messageError(error);
              this.loader = false;
            }
        );
      }else{
        this.formEditContacto= this.fb.group({
          nombre_contacto: [this.formEditContacto.get('nombre_contacto').value, Validators.compose([
              Validators.required,
              Validators.maxLength(50),
              Validaciones.verificarEspacios,
          ])],
          apellido_contacto: this.formEditContacto.get('apellido_contacto').value,
          religion_judia: this.formEditContacto.get('religion_judia').value,
          medio_contacto: [this.formEditContacto.get('medio_contacto').value, Validators.compose([
              Validators.required,
              Validaciones.verificarEspacios,
          ])],
          comentarios_contactos: this.formEditContacto.get('comentarios_contactos').value,
          es_principal: this.formEditContacto.get('es_principal').value,
        })
      }
    }
  }

  onDeleteContacto(contacto: Contacto, index: number){
    this.deleteContacto= contacto;
    this.posicionEliminarContacto= index;
  }

  //ELIMINAR EL CONTACTO
  deleteContactoBrief(){
    this.loader= true;
    this.servicio.deleteContacto(this.deleteContacto.id)
    .subscribe(
        data => {
          $('#eliminar-contacto').modal('hide');
          this.modelContacto.splice(this.posicionEliminarContacto, 1);
          this.loader= false;
          this.toastyService.error("El contacto fue eliminado exitosamente");
        },
        error => {
          this.alert_server.messageError(error);
          this.loader= false;
        }
    );
  }

  // SERVICIOS
  // ABRIR MODAL DE CREACION DE SERVICIO
  showModalCreateServicio():void {
      this.modalCreateServicio.show();
      this.createServicioForm();
  }

  // CERRAR MODAL DE CREACION DE CONTACTO
  hideModalCreateServicio():void {
      this.modalCreateServicio.hide();
      this.isSubmitServicio= false;
      this.servicioRecurrente= false;
      this.formCreateServicio.reset({
        id_servicio: '',
        cantidad_mensual: '',
      });
  }

  // CARGAR LISTADO DE SERVICIOS
  loadServiciosContratados(){
    this.servicio.getListadoServicios().subscribe(
      list => {
        this.listServiciosContratados = list;
      },
      error => {
        this.alert_server.messageError(error);
      }
    );
  }

  // CAPTURAR DATOS DE SERVICIO CONTRATADO CREACION
  capturarServicioContratadoCreate(event: any, id: number){
    this.nombreServicioContratado= event.target.selectedOptions[0].innerHTML;

    for (let selectServicio of this.listServiciosContratados) {
        if (selectServicio.id == id) {
          this.servicioRecurrente= selectServicio.es_recurrente;
        };
    }
  }

  // CREAR SERVICIO
  createServicio(){
    this.isSubmitServicio= true;

    if (this.formBrief.get('fecha_comienzo').value) {
      var fecha_comienzo: any = [this.formBrief.get('fecha_comienzo').value.date.year, this.formBrief.get('fecha_comienzo').value.date.month, this.formBrief.get('fecha_comienzo').value.date.day].join('-');
    }else{
      var fecha_comienzo= this.formBrief.get('fecha_comienzo').value;
    }

    if (this.servicioRecurrente) {

      if (this.formCreateServicio.valid && this.isSubmitServicio) {
        let model : any = {
          cantidad_mensual: this.formCreateServicio.get('cantidad_mensual').value,
          id_servicio: this.formCreateServicio.get('id_servicio').value,
          nombre_servicio: this.nombreServicioContratado,
          es_recurrente: true,
          id_brief: this.selectedId,
          fecha_comienzo: fecha_comienzo,
        };
        this.loader = true;
        this.servicio.addServicio(model)
        .subscribe(
            data => {
              this.modelServicioContratado= [];
              this.cargarDatosServicios(data);
              this.isSubmitServicio= false;
              this.servicioRecurrente= false;
              this.formCreateServicio.reset({
                id_servicio: '',
                cantidad_mensual: '',
              });
              this.toastyService.success("El servicio fue creado exitosamente");
              this.loader = false;
              this.modalCreateServicio.hide();
            },
            error => {
              this.alert_server.messageError(error);
              this.loader = false;
            }
        );
      }else{
        this.formCreateServicio= this.fb.group({
          id_servicio: [this.formCreateServicio.get('id_servicio').value, Validators.compose([
              Validators.required,
          ])],
          cantidad_mensual: [this.formCreateServicio.get('cantidad_mensual').value, Validators.compose([
              Validators.required,
          ])],
        })
      }

    }else{

      if (this.formCreateServicio.get('id_servicio').valid && this.isSubmitServicio) {
        let model : any = {
          cantidad_mensual: null,
          id_servicio: this.formCreateServicio.get('id_servicio').value,
          nombre_servicio: this.nombreServicioContratado,
          es_recurrente: false,
          id_brief: this.selectedId,
          fecha_comienzo: fecha_comienzo,
        };
        this.loader = true;
        this.servicio.addServicio(model)
        .subscribe(
            data => {
              this.modelServicioContratado= [];
              this.cargarDatosServicios(data);
              this.isSubmitServicio= false;
              this.servicioRecurrente= false;
              this.formCreateServicio.reset({
                id_servicio: '',
                cantidad_mensual: '',
              });
              this.toastyService.success("El servicio fue creado exitosamente");
              this.loader = false;
              this.modalCreateServicio.hide();
            },
            error => {
              this.alert_server.messageError(error);
              this.loader = false;
            }
        );
      }else{
        this.formCreateServicio= this.fb.group({
          id_servicio: [this.formCreateServicio.get('id_servicio').value, Validators.compose([
              Validators.required,
          ])],
          cantidad_mensual: ''
        })
      }

    }

  }

  // ABRIR MODAL DE EDICION DE SERVICIO
  showModalEditServicio(servicio: ServicioContratado, index: number){
      this.editServicioContratado= servicio;
      this.modalEditServicio.show();
      this.indexModalEdicionServicio= index;

      this.servicioRecurrenteEdit= this.modelServicioContratado[index].es_recurrente;

      this.formEditServicio= this.fb.group({
        cantidad_mensual: [this.modelServicioContratado[index].cantidad_mensual, Validators.compose([
            Validators.required,
        ])],
      })

  }

  // CAPTURAR DATOS DE SERVICIO CONTRATADO EDICION
  capturarServicioContratadoEdit(event: any, id: number){
    this.nombreServicioContratado= event.target.selectedOptions[0].innerHTML;

    for (let selectServicio of this.listServiciosContratados) {
        if (selectServicio.id == id) {
          this.servicioRecurrenteEdit= selectServicio.es_recurrente;
        };
    }
  }

  // CERRAR MODAL DE CREACION DE CONTACTO
  hideModalEditServicio():void {
      this.modalEditServicio.hide();
      this.isSubmitServicio= false;
      this.servicioRecurrenteEdit= false;
      this.formEditServicio.reset({
        cantidad_mensual: '',
      });
  }

  // EDITAR SERVICIO
  editServicio(){
    this.isSubmitServicio= true;

    if (this.formBrief.get('fecha_comienzo').value) {
      var fecha_comienzo: any = [this.formBrief.get('fecha_comienzo').value.date.year, this.formBrief.get('fecha_comienzo').value.date.month, this.formBrief.get('fecha_comienzo').value.date.day].join('-');
    }else{
      var fecha_comienzo= this.formBrief.get('fecha_comienzo').value;
    }

    if (this.servicioRecurrenteEdit) {

      if(this.formEditServicio.valid && this.isSubmitServicio){

        if (this.nombreServicioContratado) {
            var nombre_servicio= this.nombreServicioContratado;
        }else{
            var nombre_servicio= this.modelServicioContratado[this.indexModalEdicionServicio].nombre_servicio;
        }

        let model : any = {
          cantidad_mensual: this.formEditServicio.get('cantidad_mensual').value,
        };
        this.modelServicioContratado[this.indexModalEdicionServicio].cantidad_mensual= model.cantidad_mensual;

        let arrayServicio= JSON.stringify(this.modelServicioContratado[this.indexModalEdicionServicio]);
        let modelArray: any = {
          arrayServicio: arrayServicio,
        }
        this.loader = true;
        this.servicio.editServicio(modelArray, this.selectedId)
        .subscribe(
            data => {
              this.modelServicioContratado= [];
              this.cargarDatosServicios(data);
              this.isSubmitServicio= false;
              this.servicioRecurrenteEdit= false;
              this.formEditServicio.reset({
                cantidad_mensual: '',
              });
              this.toastyService.info("El servicio fue editado exitosamente");
              this.loader = false;
              this.modalEditServicio.hide();
            },
            error => {
              this.alert_server.messageError(error);
              this.loader = false;
            }
        );
      }else{
        this.formEditServicio= this.fb.group({
          id_servicio: [this.formEditServicio.get('id_servicio').value, Validators.compose([
              Validators.required,
          ])],
          cantidad_mensual: [this.formEditServicio.get('cantidad_mensual').value, Validators.compose([
              Validators.required,
          ])],
        })
      }

    }else{

      if(this.formEditServicio.get('id_servicio').valid && this.isSubmitServicio){

        if (this.nombreServicioContratado) {
            var nombre_servicio= this.nombreServicioContratado;
        }else{
            var nombre_servicio= this.modelServicioContratado[this.indexModalEdicionServicio].nombre_servicio;
        }

        let model : any = {
          cantidad_mensual: null,
        };
        this.modelServicioContratado[this.indexModalEdicionServicio].cantidad_mensual= model.cantidad_mensual;

        let arrayServicio= JSON.stringify(this.modelServicioContratado[this.indexModalEdicionServicio]);
        let modelArray: any = {
          arrayServicio: arrayServicio,
        }
        this.loader = true;
        this.servicio.editServicio(modelArray, this.selectedId)
        .subscribe(
            data => {
              this.modelServicioContratado= [];
              this.cargarDatosServicios(data);
              this.isSubmitServicio= false;
              this.servicioRecurrenteEdit= false;
              this.formEditServicio.reset({
                cantidad_mensual: '',
              });
              this.toastyService.info("El servicio fue editado exitosamente");
              this.loader = false;
              this.modalEditServicio.hide();
            },
            error => {
              this.alert_server.messageError(error);
              this.loader = false;
            }
        );
      }else{
        this.formEditServicio= this.fb.group({
          id_servicio: [this.formEditServicio.get('id_servicio').value, Validators.compose([
              Validators.required,
          ])],
          cantidad_mensual: '',
        })
      }

    }

  }

  onDeleteServicio(servicio: ServicioContratado, index: number){
    this.deleteServicio= servicio;
    this.posicionEliminarServicio= index;
  }

  //ELIMINAR EL CONTACTO
  deleteServicioBrief(){
    this.loader= true;
    this.servicio.deleteServicio(this.deleteServicio.id)
    .subscribe(
        data => {
          $('#eliminar-servicio').modal('hide');
          this.modelServicioContratado.splice(this.posicionEliminarServicio, 1);
          this.loader= false;
          this.toastyService.error("El servicio fue eliminado exitosamente");
        },
        error => {
          this.alert_server.messageError(error);
          this.loader= false;
        }
    );
  }

  // CAPTURAR FECHA DE COMIENZO
  capturarFechaComienzo(event: any){
    this.guardarCambio('fecha_comienzo', event.formatted);
  }

  // GUARDAR AUTOMATOICAMENTE EN CHANGE DE LOS INPUTS
  guardarCambio(campo: any, valorCampo: any){
    if (this.formBrief.get(campo).valid || campo == 'fecha_comienzo') {
        if (campo == 'id_tipo_empresa' || campo == 'id_tipo_venta' || campo == 'id_canal_adquisicion') {
          valorCampo=  JSON.stringify(this.formBrief.get(campo).value);
        }
        this.estadoGuardado= false;
        let model: Object = {
          campo: campo,
          valorCampo: valorCampo,
          guardar: 1
        }
        this.servicio.update(model, this.selectedId)
        .subscribe(
            data => {
              this.estadoGuardado= true;
            },
            error => {
                this.estadoGuardado= false;
                this.alert_server.messageError(error);
            }
        );
    }

  }

  // CREACION DE BRIEF DE VENTA
  generarBrief(){
    if (this.formBrief.valid) {
      if (this.modelContacto.length >= 1) {
        if (this.modelServicioContratado.length >= 1) {
          let arrayContacto= JSON.stringify(this.modelContacto);
          let arrayServicio= JSON.stringify(this.modelServicioContratado);
          let arrayTipoEmpresa= JSON.stringify(this.formBrief.get('id_tipo_empresa').value);
          let arrayTipoVenta= JSON.stringify(this.formBrief.get('id_tipo_venta').value);
          let arrayCanalAdquisicion= JSON.stringify(this.formBrief.get('id_canal_adquisicion').value);

          if (this.formBrief.get('fecha_comienzo').value) {
            var fecha_comienzo: any = [this.formBrief.get('fecha_comienzo').value.date.year, this.formBrief.get('fecha_comienzo').value.date.month, this.formBrief.get('fecha_comienzo').value.date.day].join('-');
          }else{
            var fecha_comienzo= this.formBrief.get('fecha_comienzo').value;
          }

          let model: Object= {
            id: this.selectedId,
            nombre: this.formBrief.get('nombre').value,
            pm_asignado: this.formBrief.get('pm_asignado').value,
            fecha_comienzo: fecha_comienzo,
            propuesta_original: this.formBrief.get('propuesta_original').value,
            monto_abono: this.formBrief.get('monto_abono').value,
            presupuesto_invertir_publicidad: this.formBrief.get('presupuesto_invertir_publicidad').value,
            distribucion_presupuesto_publicidad: this.formBrief.get('distribucion_presupuesto_publicidad').value,
            id_metodo_facturacion: this.formBrief.get('id_metodo_facturacion').value,
            sitio_web: this.formBrief.get('sitio_web').value,
            fan_page: this.formBrief.get('fan_page').value,
            arrayTipoEmpresa: arrayTipoEmpresa,
            rubro: this.formBrief.get('rubro').value,
            arrayTipoVenta: arrayTipoVenta,
            modelo_negocio: this.formBrief.get('modelo_negocio').value,
            calidad_modelo_negocio: this.formBrief.get('calidad_modelo_negocio').value,
            acciones_realiza_internet: this.formBrief.get('acciones_realiza_internet').value,
            upselibilidad: this.formBrief.get('upselibilidad').value,
            comentario_upselibilidad: this.formBrief.get('comentario_upselibilidad').value,
            educabilidad: this.formBrief.get('educabilidad').value,
            comentario_educabilidad: this.formBrief.get('comentario_educabilidad').value,
            arrayCanalAdquisicion: arrayCanalAdquisicion,
            comentario_adquisicion: this.formBrief.get('comentario_adquisicion').value,
            conocimiento_internet: this.formBrief.get('conocimiento_internet').value,
            capacidad_financiera_cliente: this.formBrief.get('capacidad_financiera_cliente').value,
            nivel_esperado_hinchapelotes: this.formBrief.get('nivel_esperado_hinchapelotes').value,
            puntaje_cliente: this.formBrief.get('puntaje_cliente').value,
            competidores_cliente: this.formBrief.get('competidores_cliente').value,
            personalidad: this.formBrief.get('personalidad').value,
            porque_llego: this.formBrief.get('porque_llego').value,
            servicio_buscado: this.formBrief.get('servicio_buscado').value,
            arrayContacto: arrayContacto,
            arrayServicio: arrayServicio,
            id_cliente: this.dataBrief.id_cliente,
            create: 1,
          };
          this.loader = true;
          this.servicio.update(model, this.selectedId)
          .subscribe(
              data => {
                this.router.navigate(['/briefs']);
                $('#confirmar-generar-brief').modal('hide');
                this.toastyService.success("El brief de venta fue generado exitosamente");
              },
              error => {
                  this.alert_server.messageError(error);
                  this.loader = false;
              }
          );
        }else{
          this.toastyService.error("Debe asignar al menos un servicio al brief");
          this.loader = false;
        }
      }else{
          this.toastyService.error("Debe asignar al menos un comtacto al brief");
          this.loader = false;
      }
    }else{
      this.formBrief= this.fb.group({
        nombre: [this.formBrief.get('nombre').value, Validators.compose([
            Validators.required,
            Validators.maxLength(50),
            Validaciones.verificarEspacios,
        ])],
        pm_asignado: [this.formBrief.get('pm_asignado').value, Validators.compose([
            Validators.required,
        ])],
        fecha_comienzo: [this.formBrief.get('fecha_comienzo').value, Validators.compose([
            Validators.required,
        ])],
        propuesta_original: [this.formBrief.get('propuesta_original').value, Validators.compose([
            Validators.required,
        ])],
        monto_abono: [this.formBrief.get('monto_abono').value, Validators.compose([
            Validators.required,
        ])],
        presupuesto_invertir_publicidad: [this.formBrief.get('presupuesto_invertir_publicidad').value, Validators.compose([
            Validators.required,
        ])],
        distribucion_presupuesto_publicidad: this.formBrief.get('distribucion_presupuesto_publicidad').value,
        id_metodo_facturacion: [this.formBrief.get('id_metodo_facturacion').value, Validators.compose([
            Validators.required,
        ])],
        sitio_web: [this.formBrief.get('sitio_web').value, Validators.compose([
            Validators.maxLength(80),
        ])],
        fan_page: [this.formBrief.get('fan_page').value, Validators.compose([
            Validators.maxLength(80),
        ])],
        id_tipo_empresa: [this.formBrief.get('id_tipo_empresa').value, Validators.compose([
            Validators.required,
        ])],
        rubro: [this.formBrief.get('rubro').value, Validators.compose([
            Validators.required,
        ])],
        id_tipo_venta: [this.formBrief.get('id_tipo_venta').value, Validators.compose([
            Validators.required,
        ])],
        modelo_negocio: [this.formBrief.get('modelo_negocio').value, Validators.compose([
            Validators.required,
        ])],
        calidad_modelo_negocio: [this.formBrief.get('calidad_modelo_negocio').value, Validators.compose([
            Validators.required,
        ])],
        acciones_realiza_internet: [this.formBrief.get('acciones_realiza_internet').value, Validators.compose([
            Validators.required,
        ])],
        upselibilidad: [this.formBrief.get('upselibilidad').value, Validators.compose([
            Validators.required,
        ])],
        comentario_upselibilidad: [this.formBrief.get('comentario_upselibilidad').value, Validators.compose([
            Validators.required,
        ])],
        educabilidad: [this.formBrief.get('educabilidad').value, Validators.compose([
            Validators.required,
        ])],
        comentario_educabilidad: [this.formBrief.get('comentario_educabilidad').value, Validators.compose([
            Validators.required,
        ])],
        id_canal_adquisicion: [this.formBrief.get('id_canal_adquisicion').value, Validators.compose([
            Validators.required,
        ])],
        comentario_adquisicion: [this.formBrief.get('comentario_adquisicion').value, Validators.compose([
            Validators.required,
        ])],
        conocimiento_internet: [this.formBrief.get('conocimiento_internet').value, Validators.compose([
            Validators.required,
        ])],
        capacidad_financiera_cliente: [this.formBrief.get('capacidad_financiera_cliente').value, Validators.compose([
            Validators.required,
        ])],
        nivel_esperado_hinchapelotes: [this.formBrief.get('nivel_esperado_hinchapelotes').value, Validators.compose([
            Validators.required,
        ])],
        puntaje_cliente: [this.formBrief.get('puntaje_cliente').value, Validators.compose([
            Validators.required,
            Validators.pattern(/^(?:10|[1-9])$/m),
        ])],
        competidores_cliente: [this.formBrief.get('competidores_cliente').value, Validators.compose([
            Validators.required,
        ])],
        personalidad: [this.formBrief.get('personalidad').value, Validators.compose([
            Validators.required,
        ])],
        porque_llego: [this.formBrief.get('porque_llego').value, Validators.compose([
            Validators.required,
        ])],
        servicio_buscado: [this.formBrief.get('servicio_buscado').value, Validators.compose([
            Validators.required,
        ])],
      })
    }

  }

  // GUARDAR BRIEF EN BORRADOR
  borradorBrief(){
    if (this.formBrief.get('nombre').valid) {
      let arrayContacto= JSON.stringify(this.modelContacto);
      let arrayServicio= JSON.stringify(this.modelServicioContratado);
      let arrayTipoEmpresa= JSON.stringify(this.formBrief.get('id_tipo_empresa').value);
      let arrayTipoVenta= JSON.stringify(this.formBrief.get('id_tipo_venta').value);
      let arrayCanalAdquisicion= JSON.stringify(this.formBrief.get('id_canal_adquisicion').value);

      if (this.formBrief.get('fecha_comienzo').value) {
        var fecha_comienzo: any = [this.formBrief.get('fecha_comienzo').value.date.year, this.formBrief.get('fecha_comienzo').value.date.month, this.formBrief.get('fecha_comienzo').value.date.day].join('-');
      }else{
        var fecha_comienzo= this.formBrief.get('fecha_comienzo').value;
      }

      let model: any= {
        nombre: this.formBrief.get('nombre').value,
        pm_asignado: this.formBrief.get('pm_asignado').value,
        fecha_comienzo: fecha_comienzo,
        propuesta_original: this.formBrief.get('propuesta_original').value,
        monto_abono: this.formBrief.get('monto_abono').value,
        presupuesto_invertir_publicidad: this.formBrief.get('presupuesto_invertir_publicidad').value,
        distribucion_presupuesto_publicidad: this.formBrief.get('distribucion_presupuesto_publicidad').value,
        id_metodo_facturacion: this.formBrief.get('id_metodo_facturacion').value,
        sitio_web: this.formBrief.get('sitio_web').value,
        fan_page: this.formBrief.get('fan_page').value,
        arrayTipoEmpresa: arrayTipoEmpresa,
        rubro: this.formBrief.get('rubro').value,
        arrayTipoVenta: arrayTipoVenta,
        modelo_negocio: this.formBrief.get('modelo_negocio').value,
        calidad_modelo_negocio: this.formBrief.get('calidad_modelo_negocio').value,
        acciones_realiza_internet: this.formBrief.get('acciones_realiza_internet').value,
        upselibilidad: this.formBrief.get('upselibilidad').value,
        comentario_upselibilidad: this.formBrief.get('comentario_upselibilidad').value,
        educabilidad: this.formBrief.get('educabilidad').value,
        comentario_educabilidad: this.formBrief.get('comentario_educabilidad').value,
        arrayCanalAdquisicion: arrayCanalAdquisicion,
        comentario_adquisicion: this.formBrief.get('comentario_adquisicion').value,
        conocimiento_internet: this.formBrief.get('conocimiento_internet').value,
        capacidad_financiera_cliente: this.formBrief.get('capacidad_financiera_cliente').value,
        nivel_esperado_hinchapelotes: this.formBrief.get('nivel_esperado_hinchapelotes').value,
        puntaje_cliente: this.formBrief.get('puntaje_cliente').value,
        competidores_cliente: this.formBrief.get('competidores_cliente').value,
        personalidad: this.formBrief.get('personalidad').value,
        porque_llego: this.formBrief.get('porque_llego').value,
        servicio_buscado: this.formBrief.get('servicio_buscado').value,
        arrayContacto: arrayContacto,
        arrayServicio: arrayServicio,
        borrador: 1,
      };
      this.loader = true;
      this.servicio.update(model, this.selectedId)
      .subscribe(
        data => {
          this.router.navigate(['/briefs']);
          this.toastyService.info("El brief fue guardado en borrador");
        },
        error => {
          this.loader = false;
          this.alert_server.messageError(error);
        }
      );
    }else{
      this.formBrief= this.fb.group({
        nombre: [this.formBrief.get('nombre').value, Validators.compose([
            Validators.required,
            Validators.maxLength(50),
            Validaciones.verificarEspacios,
        ])],
        pm_asignado: [this.formBrief.get('pm_asignado').value, Validators.compose([
            Validators.required,
        ])],
        fecha_comienzo: [this.formBrief.get('fecha_comienzo').value, Validators.compose([
            Validators.required,
        ])],
        propuesta_original: [this.formBrief.get('propuesta_original').value, Validators.compose([
            Validators.required,
        ])],
        monto_abono: [this.formBrief.get('monto_abono').value, Validators.compose([
            Validators.required,
        ])],
        presupuesto_invertir_publicidad: [this.formBrief.get('presupuesto_invertir_publicidad').value, Validators.compose([
            Validators.required,
        ])],
        distribucion_presupuesto_publicidad: this.formBrief.get('distribucion_presupuesto_publicidad').value,
        id_metodo_facturacion: [this.formBrief.get('id_metodo_facturacion').value, Validators.compose([
            Validators.required,
        ])],
        sitio_web: [this.formBrief.get('sitio_web').value, Validators.compose([
            Validators.maxLength(80),
        ])],
        fan_page: [this.formBrief.get('fan_page').value, Validators.compose([
            Validators.maxLength(80),
        ])],
        id_tipo_empresa: [this.formBrief.get('id_tipo_empresa').value, Validators.compose([
            Validators.required,
        ])],
        rubro: [this.formBrief.get('rubro').value, Validators.compose([
            Validators.required,
        ])],
        id_tipo_venta: [this.formBrief.get('id_tipo_venta').value, Validators.compose([
            Validators.required,
        ])],
        modelo_negocio: [this.formBrief.get('modelo_negocio').value, Validators.compose([
            Validators.required,
        ])],
        calidad_modelo_negocio: [this.formBrief.get('calidad_modelo_negocio').value, Validators.compose([
            Validators.required,
        ])],
        acciones_realiza_internet: [this.formBrief.get('acciones_realiza_internet').value, Validators.compose([
            Validators.required,
        ])],
        upselibilidad: [this.formBrief.get('upselibilidad').value, Validators.compose([
            Validators.required,
        ])],
        comentario_upselibilidad: [this.formBrief.get('comentario_upselibilidad').value, Validators.compose([
            Validators.required,
        ])],
        educabilidad: [this.formBrief.get('educabilidad').value, Validators.compose([
            Validators.required,
        ])],
        comentario_educabilidad: [this.formBrief.get('comentario_educabilidad').value, Validators.compose([
            Validators.required,
        ])],
        id_canal_adquisicion: [this.formBrief.get('id_canal_adquisicion').value, Validators.compose([
            Validators.required,
        ])],
        comentario_adquisicion: [this.formBrief.get('comentario_adquisicion').value, Validators.compose([
            Validators.required,
        ])],
        conocimiento_internet: [this.formBrief.get('conocimiento_internet').value, Validators.compose([
            Validators.required,
        ])],
        capacidad_financiera_cliente: [this.formBrief.get('capacidad_financiera_cliente').value, Validators.compose([
            Validators.required,
        ])],
        nivel_esperado_hinchapelotes: [this.formBrief.get('nivel_esperado_hinchapelotes').value, Validators.compose([
            Validators.required,
        ])],
        puntaje_cliente: [this.formBrief.get('puntaje_cliente').value, Validators.compose([
            Validators.required,
            Validators.pattern(/^(?:10|[1-9])$/m),
        ])],
        competidores_cliente: [this.formBrief.get('competidores_cliente').value, Validators.compose([
            Validators.required,
        ])],
        personalidad: [this.formBrief.get('personalidad').value, Validators.compose([
            Validators.required,
        ])],
        porque_llego: [this.formBrief.get('porque_llego').value, Validators.compose([
            Validators.required,
        ])],
        servicio_buscado: [this.formBrief.get('servicio_buscado').value, Validators.compose([
            Validators.required,
        ])],
      })
    }

  }

}
