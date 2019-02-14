export class Cliente{
  // VENTAS
  id: number;
  created_at: Date;
  estado: string;
  nombre: string;
  pm_asignado: number;
  fecha_comienzo: Date;
  propuesta_original: string;
  monto_abono: number;
  presupuesto_invertir_publicidad: number;
  distribucion_presupuesto_publicidad: string;
  metodo_facturacion: string;
  sitio_web: string;
  fan_page: string;
  tipo_empresa: string;
  rubro: string;
  tipo_venta: string;
  modelo_negocio: string;
  calidad_modelo_negocio: string;
  acciones_realiza_internet: string;
  upselibilidad: string;
  comentario_upselibilidad: string;
  educabilidad: string;
  comentarios_educabilidad: string;
  canal_adquisicion: number;
  comentario_adquisicion: string;
  conocimiento_internet: string;
  capacidad_financiera_cliente: string;
  nivel_esperado_hinchapelotes: string;
  puntaje_cliente: number;
  competidores_cliente: string;
  personalidad: string;

  // PM
  contrato_firmado: boolean;
  etapa: string;
  obj_consultas_mensuales: number;
  scoring: boolean;
  landing: number;
  resumen_cliente: string;

  // OPTIMIZACION
  id_adword: string;

  // ADMINISTRACION
  quien_factura: string;
  forma_pago: string;
  condicion_iva: string;
  cuit: number;
  asunto_factura: number;
  nombre_fiscal: string;
  direccion_retiro_pago: string;
  comentario_pm: string;
}
