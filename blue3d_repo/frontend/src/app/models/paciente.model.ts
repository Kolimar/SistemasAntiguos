import { ObraSocial, Particular } from '../models/index';
export class Paciente{
  id: number;
  fecha_nacimiento: string;
  dni: number;
  nombres: string;
  apellidos: string;
  n_afiliado: string;
  domicilio: string;
  n_departamento: string;
  barrio: string;
  telefono: string;
  celular: string;
  email: string;
  observaciones: string;
  id_obra_social: number;
  nombre_obra_social: string;
  id_particular: number;
  nombre_particular: string;
  plan_os: string;
  obra_social: ObraSocial;
  particular: Particular;
}
