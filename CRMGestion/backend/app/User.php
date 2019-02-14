<?php

namespace App;

use Illuminate\Notifications\Notifiable;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $table = 'users';
    protected $fillable = [
        'nombres',
        'apellidos',
        'id_puesto',
        'telefono_laboral',
        'celular_laboral',
        'email_laboral',
        'telefono_personal',
        'celular_personal',
        'email_personal',
        'password',
        'habilitado',
        'created_at',
        'created_by'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token'
    ];

    public function tareas()
    {
        return $this->hasMany('App\Tarea');
    }

    public function clientes()
    {
        return $this->hasMany('App\Cliente');
    }

    public function briefs()
    {
        return $this->hasMany('App\Brief');
    }

    public function contactos()
    {
        return $this->hasMany('App\Contacto');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHAS TAREAS TEMPLATES
    public function creadorTareasTemplate()
    {
        return $this->hasMany('App\TareaTemplate', 'created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS SERVICIOS
    public function creadorServicios()
    {
        return $this->hasMany('App\Servicio', 'created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS TAREAS TEMPLATES DE SERVICIOS
    public function creadorServiciosTareasTemplates()
    {
        return $this->hasMany('App\ServicioTareaTemplate', 'created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHAS TAREAS
    public function creadorTareas()
    {
        return $this->hasMany('App\Tarea', 'created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHAS SUB TAREAS
    public function creadorSubtareas()
    {
        return $this->hasMany('App\Subtarea', 'created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS BRIEFS
    public function creadorBriefs()
    {
        return $this->hasMany('App\Brief', 'created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS CLIENTES
    public function creadorClientes()
    {
        return $this->hasMany('App\Cliente', 'created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS CONTACTOS DE BRIEFS
    public function creadorContactosBriefs()
    {
        return $this->hasMany('App\Contacto', 'created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS CONTACTOS DE CLIENTES
    public function creadorContactosClientes()
    {
        return $this->hasMany('App\ContactoCliente', 'created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS TIPOS DE TAREA
    public function creadorTiposTarea()
    {
        return $this->hasMany('App\TipoTarea','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHAS FORMAS DE PAGO
    public function creadorFormasPago()
    {
        return $this->hasMany('App\FormaPago','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS METODOS DE FACTURACION
    public function creadorMetodosFacturacion()
    {
        return $this->hasMany('App\MetodoFacturacion','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS TIPOS DE TELEFONOS
    public function creadorTiposTelefono()
    {
        return $this->hasMany('App\TipoTelefono','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS ROLES DE CONTACTO
    public function creadorRolesContacto()
    {
        return $this->hasMany('App\RolContacto','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS ROLES DE CONTACTO
    public function creadorRolesContactoClientes()
    {
        return $this->hasMany('App\RolContactoCliente','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS TELEFONOS DE BRIEF
    public function creadorTelefonoContactoBrief()
    {
        return $this->hasMany('App\TelefonoContacto','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS TELEFONOS DE CLIENTE
    public function creadorTelefonoContactoCliente()
    {
        return $this->hasMany('App\TelefonoContactoCliente','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS EMAILS DE BRIEF
    public function creadorEmailContactoBrief()
    {
        return $this->hasMany('App\EmailContacto','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS EMAILS DE CLIENTE
    public function creadorEmailContactoCliente()
    {
        return $this->hasMany('App\EmailContactoCliente','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS BRIEFS FORMAS DE PAGO
    public function creadorBriefFormaPago()
    {
        return $this->hasMany('App\BriefFormaPago','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS CLIENTES FORMAS DE PAGO
    public function creadorClienteFormaPago()
    {
        return $this->hasMany('App\ClienteFormaPago','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS TIPOS DE EMPRESA
    public function creadorTiposEmpresa()
    {
        return $this->hasMany('App\TipoEmpresa','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS BRIEFS TIPOS DE EMPRESA
    public function creadorBriefTiposEmpresa()
    {
        return $this->hasMany('App\BriefTipoEmpresa','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS CLIENTES TIPOS DE EMPRESA
    public function creadorClienteTiposEmpresa()
    {
        return $this->hasMany('App\ClienteTipoEmpresa','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS TIPOS DE VENTA
    public function creadorTiposVenta()
    {
        return $this->hasMany('App\TipoVenta','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS BRIEFS TIPOS DE VENTAS
    public function creadorBriefTiposVenta()
    {
        return $this->hasMany('App\BriefTipoVenta','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS CLIENTES TIPOS DE VENTAS
    public function creadorClienteTiposVenta()
    {
        return $this->hasMany('App\ClienteTipoVenta','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS CANALES DE ADQUISICION
    public function creadorCanalAdquisicion()
    {
        return $this->hasMany('App\CanalAdquisicion','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS BRIEF CANALES DE ADQUISICION
    public function creadorBriefCanalAdquisicion()
    {
        return $this->hasMany('App\BriefCanalAdquisicion','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS CLIENTE CANALES DE ADQUISICION
    public function creadorClienteCanalAdquisicion()
    {
        return $this->hasMany('App\ClienteCanalAdquisicion','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS BRIEF SERVICIOS CONTRATADOS
    public function creadorBriefServiciosContratados()
    {
        return $this->hasMany('App\BriefServicioContratado','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS CLIENTE SERVICIOS CONTRATADOS
    public function creadorClienteServiciosContratados()
    {
        return $this->hasMany('App\ClienteServicioContratado','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS BRIEF CONTACTOS
    public function creadorBriefContacto()
    {
        return $this->hasMany('App\BriefContacto','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS CLIENTE CONTACTOS
    public function creadorClienteContacto()
    {
        return $this->hasMany('App\ClienteContacto','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS BRIEF ROLES CONTACTOS
    public function creadorBriefRolContacto()
    {
        return $this->hasMany('App\BriefRolContacto','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS CLIENTE ROLES CONTACTOS
    public function creadorClienteRolContacto()
    {
        return $this->hasMany('App\ClienteRolContacto','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS MOTIVOS DE LOGS
    public function creadorMotivosLogs()
    {
        return $this->hasMany('App\MotivoLog','created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS BRIEFS DE PRIMERA REUNION
    public function creadorBriefsPrimeraReunion()
    {
        return $this->hasMany('App\BriefPrimeraReunion', 'created_by');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS BRIEFS DE PRIMERA REUNION DEL CLIENTE
    public function creadorBriefsPrimeraReunionCliente()
    {
        return $this->hasMany('App\BriefPrimeraReunionCliente', 'created_by');
    }

    // UN USUARIO PUEDE SER CREADO POR OTRO USUARIO
    public function creadaPor()
    {
        return $this->belongsTo('App\User','created_by');
    }

    // UN USUARIO PUEDE SER TENER UN PUESTO
    public function puesto()
    {
        return $this->belongsTo('App\Puesto', 'id_puesto');
    }

    // UN USUARIO PUEDE SER CREADOR DE MUCHOS LOGS
    public function creadorLogs()
    {
        return $this->belongsTo('App\Log', 'id_creador');
    }

}
