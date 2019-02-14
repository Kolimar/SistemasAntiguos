<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Brief extends Model
{
  public $timestamps = false;
  protected $table = 'briefs';
    protected $fillable = [
        'nombre',
        'pm_asignado',
        'fecha_comienzo',
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
        'eliminado',
        'ic_cliente',
        'created_by',
        'created_at',
    ];

    public function pmAsignado()
    {
        return $this->belongsTo('App\User');
    }

    public function metodoFacturacion()
    {
        return $this->belongsTo('App\MetodoFacturacion');
    }

    // MUCHOS BRIEFS PUEDEN TENER MUCHOS TIPOS DE EMPRESAS
    public function tiposEmpresas()
    {
        return $this->belongsToMany('App\TipoEmpresa', 'briefs_tipos_empresas', 'id_brief', 'id_tipo_empresa');
    }

    // MUCHOS BRIEFS PUEDEN TENER MUCHOS TIPOS DE VENTAS
    public function tiposVentas()
    {
        return $this->belongsToMany('App\TipoVenta', 'briefs_tipos_ventas', 'id_brief', 'id_tipo_venta');
    }

    // MUCHOS SERVICIOS PUEDEN SER CONTRATADOS POR MUCHOS BRIEFS
    public function servicios()
    {
        return $this->belongsToMany('App\Servicio', 'servicios_contratados', 'id_brief', 'id_servicio')->withPivot('cantidad_mensual','fecha_comienzo','created_at','created_by');;
    }

    // MUCHOS CONTACTOS PUEDEN ESTAR EN MUCHOS BRIEFS
    public function contactos()
    {
        return $this->belongsToMany('App\Contacto', 'briefs_contactos', 'id_brief', 'id_contacto');
    }

    // MUCHOS BRIEFS PUEDEN TENER MUCHOS CANALES DE ADQUISICION
    public function canalesAdquisicion()
    {
        return $this->belongsToMany('App\CanalAdquisicion', 'briefs_canales_adquisicion', 'id_brief', 'id_canal_adquisicion');
    }

    // UN BRIEF PRIMERA REUNION PUEDE TENER UN CLIENTE
    public function Cliente()
    {
        return $this->belongsTo('App\Cliente','id_cliente');
    }

    // UN BRIEF FORMA DE PAGO PUEDE SER CREADO POR UN USUARIO
    public function creadaPor()
    {
        return $this->belongsTo('App\User','created_by');
    }
}
