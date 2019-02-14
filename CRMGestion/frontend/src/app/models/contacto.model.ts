import { EmailContacto, TelefonoContacto, RolContacto } from '../models/index';

export class Contacto{
  id: number;
  nombre: string;
  apellido: string;
  es_principal: boolean;
  religion_judia: boolean;
  medio_contacto: string;
  comentario_contacto: string;
  comentarios: string;
  id_tipo_telefono: number;
  id_rol_contacto: number;
  nombre_rol: string;
  emails: EmailContacto[] = [];
  telefonos: TelefonoContacto[] = [];
  roles: RolContacto[]= [];
  id_brief: number;
  eliminado: boolean;
}
