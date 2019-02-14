import { Component, OnInit } from '@angular/core';
import { Tarea, TareaTemplate, Cliente, Servicio, User, Subtarea, Brief } from '../models/index';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { BriefService } from '../services/index';
import { AlertServer } from '../global/index';

@Component({
    moduleId: module.id,
    selector: 'brief',
    templateUrl: './brief.html',
    providers: [BriefService, AlertServer]
})

export class BriefComponent implements OnInit{
  listBriefs: Brief[]= [];
  listFiltro: any = '';
  pagina: number= -1;
  deleteBrief: Brief;
  posicionList: number;
  loader: boolean= false;

  // FILTROS
  nombre_filtro: string= '';
  fecha_filtro: string= '';
  pm_asignado_filtro:string= '';
  estado_filtro: string= '';
  nombre_ord: string= '';
  fecha_ord: string= '';

  constructor(
    private servicio: BriefService,
    private alert_server: AlertServer,
    private toastyService:ToastyService,
    private toastyConfig: ToastyConfig,
  ){

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
      this.listBriefs = [];
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
  cargarListaBriefs(data: Brief[]){
      this.listBriefs = this.listBriefs.concat(data);
  }

  // LIMPIAR FILTROS
  resetFilter(){
    this.nombre_filtro= '';
    this.fecha_filtro= '';
    this.pm_asignado_filtro= '';
    this.estado_filtro= '';
    this.nombre_ord= '';
    this.fecha_ord= '';
  }

  // RECIBIR FILA DE BRIEF Y MOSTRAR EN FORMULARIO DE ELIMINACION
  onDelete(brief: Brief, index: number){
      this.deleteBrief= brief;
      this.posicionList= index;
  }

  // DELETE TAREA TEMPLATE
  delete(){
    this.loader= true;
    this.servicio.delete(this.deleteBrief.id)
    .subscribe(
        data => {
            this.actualizarListaEliminacion();
            $('#eliminar-brief').modal('hide');
            this.toastyService.error("El brief fue eliminado exitosamente");
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
      this.listBriefs.splice(this.posicionList, 1);
  }

  // CLEAN FILTROS
  cleanFilter(){
      this.resetFilter();
  }

}
