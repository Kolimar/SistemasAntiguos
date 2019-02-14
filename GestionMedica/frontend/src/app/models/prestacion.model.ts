import { ObraSocial, Particular } from '../models/index';

export class Prestacion{
  id: number;
  nombre: string;
  obras_sociales: ObraSocial[];
  particulares: Particular[];
}
