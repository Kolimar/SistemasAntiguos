<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{

  public $timestamps = false;

	protected $table = 'clientes';

    protected $fillable = [
      'nombre',
      'pm_asignado',
      'fecha_comienzo',
      'fecha_primera_reunion',
      'propuesta_original',
      'monto_abono',
      'presupuesto_invertir_publicidad',
      'distribucion_presupuesto_publicidad',
      'id_metodo_facturacion',
      'sitio_web',
      'fan_page',
      'rubro',
      'modelo_negocio',
      'calidad_modelo_negocio',
      'acciones_realiza_internet',
      'upselibilidad',
      'comentario_upselibilidad',
      'educabilidad',
      'comentario_educabilidad',
      'conocimiento_internet',
      'capacidad_financiera_cliente',
      'nivel_esperado_hinchapelotes',
      'puntaje_cliente',
      'competidores_cliente',
      'personalidad',
      'porque_llego',
      'servicio_buscado',
      'estado',
      'created_at',
      'created_by',
      'contrato_firmado',
      'etapa',
      'objetivo_mensual',
      'scoring',
      'resumen_cliente',
      'id_adwords',
      'quien_factura',
      'id_forma_pago',
      'condicion_iva',
      'cuit',
      'asunto_factura',
      'nombre_fiscal',
      'direccion_retiro_pago',
      'url_contrato',
      'comentario_pm'
    ];

    public function pmAsignado()
    {
        return $this->belongsTo('App\User');
    }

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function metodoFacturacion()
    {
        return $this->belongsTo('App\MetodoFacturacion');
    }

    // UN CLIENTE PUESE TENER MUCHAS TAREAS
    public function tareas()
    {
        return $this->hasMany('App\Tarea','id_cliente');
    }

    // MUCHOS CLIENTES PUEDEN TENER A MUCHOS CONTACTOS DE CLIENTES
    public function contactosClientes()
    {
        return $this->belongsToMany('App\ContactoCliente', 'clientes_contactos', 'id_cliente', 'id_contacto_cliente');
    }

    // MUCHOS SERVICIOS PUEDEN SER CONTRATADOS POR MUCHOS CLIENTES
    public function servicios()
    {
        return $this->belongsToMany('App\Servicio', 'clientes_servicios_contratados', 'id_cliente', 'id_servicio')->withPivot('cantidad_mensual','fecha_comienzo','eliminado','created_at','created_by');;
    }

    // MUCHOS CLIENTES PUEDEN TENER MUCHOS TIPOS DE VENTAS
    public function tiposEmpresas()
    {
        return $this->belongsToMany('App\TipoEmpresa', 'clientes_tipos_empresas', 'id_cliente', 'id_tipo_empresa');
    }

    // MUCHOS CLIENTES PUEDEN TENER MUCHOS TIPOS DE VENTAS
    public function tiposVentas()
    {
        return $this->belongsToMany('App\TipoVenta', 'clientes_tipos_ventas', 'id_cliente', 'id_tipo_venta');
    }

    // MUCHOS CLIENTES PUEDEN TENER MUCHOS CANALES DE ADQUISICION
    public function canalesAdquisicion()
    {
        return $this->belongsToMany('App\CanalAdquisicion', 'clientes_canales_adquisicion', 'id_cliente', 'id_canal_adquisicion');
    }

    // UN CLIENTE PUEDE TENER UNA FORMA DE PAGO
    public function formaPago()
    {
        return $this->belongsTo('App\FormaPago','id_forma_pago');
    }

    // UN BRIEF FORMA DE PAGO PUEDE SER CREADO POR UN USUARIO
    public function creadaPor()
    {
        return $this->belongsTo('App\User','created_by');
    }

    // UN CLIENTE PUEDE TENER MUCHOS LOGS
    public function logs()
    {
        return $this->hasMany('App\Log','id_cliente');
    }

    // UN CLIENTE PUEDE TENER UN BRIEF DE PRIMERA REUNION
    public function briefPrimeraReunion()
    {
        return $this->hasOne('App\BriefPrimeraReunion','id_cliente');
    }

    // UN CLIENTE PUEDE TENER UN BRIEF DE PRIMERA REUNION DE EL MISMO
    public function briefPrimeraReunionCliente()
    {
        return $this->hasOne('App\BriefPrimeraReunionCliente','id_cliente');
    }

    // UN CLIENTE PUEDE TENER UN BRIEF
    public function brief()
    {
        return $this->hasOne('App\Brief','id_cliente');
    }

}
