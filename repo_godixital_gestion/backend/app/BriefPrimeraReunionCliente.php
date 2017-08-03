<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BriefPrimeraReunionCliente extends Model
{

  public $timestamps = false;
  protected $table = 'briefs_primera_reunion_cliente';
  protected $fillable = [
    'contrato_firmado',
    'presentarse',
    'explicacion_agenda',
    'explicacion_interlocutor',

    // MODELO DE NEGOCIO
    'modelo_negocio',
    'expectativas_performance',
    'relevo_ventas',

    // ADWORDS
    'estrategia_general',
    'segmentacion_geografica',
    'presupuesto_adwords',
    'acceso_campana',
    'explicacion_formas_pago',
    'datos_facturacion',
    'como_buscaria_cliente',
    'aclaratoria',
    'explicacion_mejora',

    // LANDING PAGES
    'recordar_objetivo',
    'diferencia_landing',
    'mostrar_ejemplos_landings',
    'pedir_datos_landing',
    'estrategia_landing',
    'secciones_landing',
    'pq_hosteamos',
    'donde_hostear',

    // REMARKETING
    'explicacion_remarketing',
    'comentarios_remarketing',

    // FACEBOOK ADS
    'estrategia_facebook_ads',
    'datos_fan_page_ads',
    'datos_tdc',
    'presupuesto_facebook_ads',

    // FACEBOOK POSTEOS
    'estrategia_facebook_posteos',
    'datos_fan_page_posteos',

    // MAILING
    'estrategia_mailing',
    'info_primeros_mailings',
    'pedir_bd',
    'explicacion_mailing_no_ventas',

    // DATOS DE ACCESO
    'datos_sitio',

    // ADMINISTRATIVO
    'depende_administracion',
    'recordar_pago',

    // CHAT
    'explicacion_chat',

    // FINAL
    'explicacion_gestion_ventas',
    'reuniones',
    'forma_trabajo',
    'plan_accion',
    'expectativas_plan_accion',
    'reportes',
    'recordar_pago_adelantado',
    'formas_aprobacion',
    'explicacion_cantidad_landings_campañas',
    'explicacion_responder_consultas',
    'puntos_conflictos',
    'id_cliente',

    // OTROS
    'estado'
  ];

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
