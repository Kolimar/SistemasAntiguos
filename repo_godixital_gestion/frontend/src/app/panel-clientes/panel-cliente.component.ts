import { Component, OnInit, ViewChild } from '@angular/core';
import { Cliente, Tarea } from '../models/index';
import { ClienteService, TareaService } from '../services/index';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { AlertServer } from '../global/index';
import { ModalDirective } from 'ng2-bootstrap';
import { FormBuilder, Validators, NgForm, FormGroup } from '@angular/forms';

@Component({
    moduleId: module.id,
    selector: 'panel-cliente',
    templateUrl: './panel-cliente.html',
    providers : [ClienteService, TareaService, AlertServer]
})

export class PanelClienteComponent implements OnInit{
  @ViewChild('modalComentariosPm') public modalComentariosPm:ModalDirective;
  formComentarioPm: FormGroup;
  editComentarioPm: Cliente;
  listClientes: any[]= [];
  cmbClientes: Cliente[]= [];
  ultimaTareaLlamada: number;
  fechaComparacion: any;
  fechaMayor: any;
  listFiltro: any;
  pagina: number= -1;
  loader: boolean;
  posicionList: number;
  comentarioPm: string;

  // FILTROS
  cliente_filtro: string= '';
  cliente_ord: string;

  constructor(
    private servicio: ClienteService,
    private servicioTarea: TareaService,
    private toastyService:ToastyService,
    private toastyConfig: ToastyConfig,
    private alert_server: AlertServer,
    private fb: FormBuilder,
  )
  {

    // OPCIONES PREDETERMINADAS TASTY
    this.toastyConfig.theme = 'bootstrap';
    this.toastyConfig.timeout = 5000;
    this.toastyConfig.showClose = true;

  }

  // CARGA AUTOMATICA
  ngOnInit(){
    this.loadFilter();
    this.loadClientes();
  }

  // CARGA DEL COMBO CLIENTES
  loadClientes(){
      this.servicioTarea.getClientes().subscribe(
        cmbClientes => { this.cmbClientes = cmbClientes; },
        error => {
          this.alert_server.messageError(error);
        }
      );
  }

  // CARGAR BUSQUEDA EN FILTRO
  loadSearch(){
      this.search(
          this.cliente_filtro,
          this.cliente_ord,
      );
  }

  // CARGAR FILTRO
  loadFilter(){
      this.filter(
        this.cliente_filtro,
        this.cliente_ord,
      );
  }

  // RESETEAR FILTRO A VACIO
  resetFilter(){
      this.cliente_filtro= '';
      this.cliente_ord= '';
  }

  // LIMIAR FILTRO
  cleanFilter(){
      this.resetFilter();
  }

  // APLICAR FILTRADO
  filter(cliente: string, cliente_ord: string){
      this.pagina = -1;
      this.listClientes = [];
      this.search(cliente, cliente_ord);
  }

  // CARGA DATOS DEL CLIENTE
  search(cliente: string, cliente_ord: string){
      this.pagina++;
      var model: any = {
          cliente: cliente,
          cliente_ord: cliente_ord,
          pagina: this.pagina,
      }
      this.listFiltro= model;
      this.servicio.searchPanel(model).subscribe(
        data => {
          this.capturarInfo(data);
        },
        error => {
          this.alert_server.messageError(error);
        }
      );
  }

  // FORMATEAR FECHAS A YYYY-MM-DD
  formatearFechas(fecha: Date){
    var fechaObjeto= { date: { year: fecha.getUTCFullYear(), month: fecha.getUTCMonth() + 1, day: fecha.getUTCDate() } };
    var fechaFinal= fechaObjeto.date.year + "-" + fechaObjeto.date.month + "-" + fechaObjeto.date.day;
    return new Date(fechaFinal);
  }

  // CAPTURAR Columna DE INFO
  capturarInfo(cliente: any[]){
    this.listClientes = this.listClientes.concat(cliente);
    cliente= this.listClientes;

    // FECHA DE HOY
    var today= new Date();

    // 30 DIAS A PARTIR DE LA FECHA DE HOY
    var today30dias= new Date();
    var fecha30dias= today30dias.setDate(today30dias.getUTCDate() + 30);
    var fechaFinal30Dias= this.formatearFechas(new Date(fecha30dias));

    // FECHA POR VENCER 0 Y 3 DIAS
    var today3dias= new Date();
    var fecha3dias= today3dias.setDate(today3dias.getUTCDate() + 3);
    var fechaFinal3Dias= this.formatearFechas(new Date(fecha3dias));

    // FECHA POR VENCER 4 Y 7 DIAS
    var today4dias= new Date();
    var fecha4dias= today4dias.setDate(today4dias.getUTCDate() + 4);
    var fechaFinal4Dias= this.formatearFechas(new Date(fecha4dias));

    var today7dias= new Date();
    var fecha7dias= today7dias.setDate(today7dias.getUTCDate() + 7);
    var fechaFinal7Dias= this.formatearFechas(new Date(fecha7dias));

    // FECHA POR VENCER 8 DIAS EN ADELANTE
    var today8dias= new Date();
    var fecha8dias= today8dias.setDate(today8dias.getUTCDate() + 8);
    var fechaFinal8Dias= this.formatearFechas(new Date(fecha8dias));

    // RECORRER CLIENTES
    for (let i = 0; i < cliente.length; i++) {
      var tareas= cliente[i].tareas;
      var logs= cliente[i].logs;
      var arrayFechasUltimaLlamada: any[]= [];
      var arrayFechasReunionTrimestral: any[]= [];
      var llamadasPendientes: any[]= [];
      var urgentes: any[]= [];
      var vencidas: any[]= [];
      var realizadas: any[]= [];
      var porVencer0y3: any[]= [];
      var porVencer4y7: any[]= [];
      var porVencer8: any[]= [];

      // RECORRER TAREAS
      for (let j = 0; j < tareas.length; j++) {
          // VERIFICAR SI EL TIPO DE TAREA ES DE TIPO LLAMADA Y LA TAREA ESTA COMPLETADA (ULTIMA LLAMADA | INFO)
        if (tareas[j].id_tipo_tarea == 2 && tareas[j].estado == 'Completada' && tareas[j].id_cliente == cliente[i].id) {
            if (new Date(tareas[j].fecha_ejecucion) <= today) {
              // INSERTAR FECHA AL ARRAY DE FECHAS
              arrayFechasUltimaLlamada.push(new Date(tareas[j].fecha_ejecucion));
            }
        }

        // VERIFICAR SI EL TIPO DE TAREA ES REUNION TRIMESTRAL Y LA TAREA ESTA COMPLETADA (ULTIMA REUNION TRIMESTRAL | INFO)
        if (tareas[j].id_tipo_tarea == 4 && tareas[j].estado == 'Completada' && tareas[j].id_cliente == cliente[i].id) {
            if (new Date(tareas[j].fecha_ejecucion) <= today) {
              // INSERTAR FECHA AL ARRAY DE FECHAS
              arrayFechasReunionTrimestral.push(new Date(tareas[j].fecha_ejecucion));
            }
        }

        // VERIFICAR SI EL TIPO DE TAREA ES LLAMADA Y LA TAREA ESTA PENDIENTE (LLAMADAS PENDIENTES | TAREAS PENDIENTES)
        if (tareas[j].id_tipo_tarea == 2 && tareas[j].estado == 'Pendiente' && tareas[j].id_cliente == cliente[i].id) {
            llamadasPendientes.push(tareas[j].titulo);
            this.listClientes[i].llamadas_pendientes= llamadasPendientes;
        }

        // VERIFICAR SI LA TAREA ES URGENTE Y EL ESTADO ES PENDIENTE (URGENTES | TAREAS PENDIENTES)
        if (tareas[j].urgente == true && tareas[j].estado == "Pendiente" && tareas[j].id_cliente == cliente[i].id) {
            urgentes.push(tareas[j].titulo);
            this.listClientes[i].urgentes= urgentes;
        }

        // VERIFICAR SI LA TAREA ESTA PENDIENTE (TAREAS PENDIENTES)
        if (tareas[j].estado == "Pendiente" && tareas[j].id_cliente == cliente[i].id) {

            // VERIFICAR SI EXISTE FECHA LIMITE
            if (tareas[j].fecha_limite) {
              var deadline= this.formatearFechas(new Date(tareas[j].fecha_limite));

              // TAREAS QUE VENCEN EN UN RANGO DE 30 DIAS
              if (deadline.getTime() <= fechaFinal30Dias.getTime()) {

                // TAREAS VENCIDAS
                if (deadline.getTime() <= today.getTime()) {
                  vencidas.push(tareas[j]);
                  this.listClientes[i].vencidas= vencidas;
                }

                // TAREAS POR VENCER 0 y 3 DIAS
                if ((deadline.getTime() >= today.getTime()) && (deadline.getTime() <= fechaFinal3Dias.getTime())) {
                    porVencer0y3.push(tareas[j]);
                    this.listClientes[i].porVencer0y3= porVencer0y3;
                }

                // TAREAS POR VENCER 4 y 7 DIAS
                if ((deadline.getTime() >= fechaFinal4Dias.getTime()) && (deadline.getTime() <= fechaFinal7Dias.getTime())) {
                    porVencer4y7.push(tareas[j]);
                    this.listClientes[i].porVencer4y7= porVencer4y7;
                }

                // TAREAS POR VENCER 8 DIAS EN ADELANTE
                if (deadline.getTime() >= fechaFinal8Dias.getTime()) {
                    porVencer8.push(tareas[j]);
                    this.listClientes[i].porVencer8= porVencer8;
                }

              }
            }
        }

        // VERIFICAR SI LA TAREA ESTA REALIZADA
        if (tareas[j].estado == "Completada" && tareas[j].id_cliente == cliente[i].id) {
          realizadas.push(tareas[j]);
          this.listClientes[i].realizadas= realizadas;
        }

      }

      // RECORRER LOGS
      for (let k = 0; k < logs.length; k++) {
        if (new Date(logs[k].fecha_hora) < today) {
          // INSERTAR FECHA AL ARRAY DE FECHAS
          arrayFechasUltimaLlamada.push(new Date(logs[k].fecha_hora));
        }
      }

      // ENVIAR A FUNCION ARRAY DE FECHAS QUE CONVIERTE EN DIAS, MESES, AÑOS
      if (arrayFechasUltimaLlamada.length != 0) {
        this.listClientes[i].ultima_llamada= this.convertirFechasDiasMesArray(arrayFechasUltimaLlamada);
      }

      // ENVIAR A FUNCION ARRAY DE FECHAS QUE CONVIERTE EN DIAS, MESES, AÑOS
      if (arrayFechasReunionTrimestral.length != 0) {
        this.listClientes[i].reunion_trimestral= this.convertirFechasDiasMesArray(arrayFechasReunionTrimestral);
      }

      // VERIFICAR SI EL CLIENTE ESTA ACTIVO
      if (cliente[i].estado == true) {
        // ENVIAR A FUNCION FECHA QUE CONVIERTE EN DIAS, MESES, AÑOS
        this.listClientes[i].activo_hace= this.convertirFechasDiasMes(cliente[i].fecha_comienzo);
      }

      // LIMITAR CARACTERES DE CPMENTARIOS DE PM
      if (cliente[i].comentario_pm != null) {
        this.listClientes[i].comentario_pm_limit= cliente[i].comentario_pm.substring(0, 30);
        this.listClientes[i].comentario_pm= cliente[i].comentario_pm;
      }

    }

  }

  // CONVERTIR FECHA EN FORMATO DE DIAS Y MESES CUANDO RECIBO UN ARRAY
  convertirFechasDiasMesArray(arrayDate: any[]){
    let maxDate= new Date(Math.max.apply(null,arrayDate));
    var today= new Date();

    var timeDiff = Math.abs(today.getTime() - maxDate.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays;
  }

  // CONVERTIR FECHA EN FORMATO DE DIAS Y MESES
  convertirFechasDiasMes(date: any){
    let maxDate= new Date(date);
    var today= new Date();

    var timeDiff = Math.abs(today.getTime() - maxDate.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    var fechaTotal: any;

    // VERIFICAR SI LOS DIAS ES MENOR A UN AÑO
    if (diffDays <= 365) {

      // VERIFICAR QUE SEA MAYOR A 60 DIAS PARA CONTAR EN MESES
      if (diffDays >= 60) {

        var meses= diffDays/30;
        fechaTotal= Math.trunc(meses) + " meses";

      }else{
        // SI ES MENOR QUE 60 DIAS SE CUENTA EN DIAS
        fechaTotal= diffDays + " días";
      }

    }else{
      var años= Math.trunc(diffDays/365) + " años y ";
      var mesesAños= Math.trunc((diffDays-(365 * Math.trunc(diffDays/365)))/30) + " meses";

      fechaTotal= años + mesesAños;
    }
    return fechaTotal;
  }

  // ABRIR MODAL DE COMENTARIOS DEL PM
  showModalComentariosPm(cliente: Cliente, index: number):void {
      this.modalComentariosPm.show();
      this.posicionList= index;
      this.editComentarioPm= cliente;
      this.formComentarioPm= this.fb.group({
          comentario_pm: cliente.comentario_pm
      })
  }

  // CERRAR MODAL DE CREACION
  hideModalComentariosPm():void {
      this.modalComentariosPm.hide();
  }

  // GUARDAR COMENTARIO DE PM
  guardarComentarioPm(){

    var valorCampo= this.formComentarioPm.get('comentario_pm').value;
    valorCampo= valorCampo.trim();
    let model: Object = {
      campo: 'comentario_pm',
      valorCampo: valorCampo,
      guardar: 1
    }
    this.loader= true;
    this.servicio.update(model, this.editComentarioPm.id)
    .subscribe(
        data => {
          this.modalComentariosPm.hide();
          this.actualizarListaEdicion(data);
          this.loader= false;
          this.toastyService.info("Los comentarios del pm fueron guardados con exito");
        },
        error => {
            this.alert_server.messageError(error);
        }
    );

  }

  // ACTUALIZAR REGISTRO EN LA LISTA
  actualizarListaEdicion(data: any){
      this.listClientes[this.posicionList].comentario_pm= data.cliente[0].comentario_pm;
      this.listClientes[this.posicionList].comentario_pm_limit= data.cliente[0].comentario_pm.substring(0, 60);
  }

  // EXPANDIR FILA EN EVENTO MOUSE OVER
  expandirFila(i: number){
    $('.expandir-fila'+i).css('display','inline');
    $('.solapar-fila'+i).css('display','none');
  }

  solaparFila(i: number){
    $('.expandir-fila'+i).css('display','none');
    $('.solapar-fila'+i).css('display','inline');
  }

}
