export class User {
    id: number;
    nombres: string;
    apellidos: string;
    email_laboral: string;
    email_personal: string;
    celular_laboral: string;
    celular_personal: string;
    telefono_laboral: string;
    telefono_personal: string;
    password: string;
    id_created_by: number;
    created_at: string;
    id_puesto: number;
    token: string;
    id_cliente: number;
    habilitado: boolean;
    user: User;
}
