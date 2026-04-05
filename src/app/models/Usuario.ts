import { Rol } from "./Rol"

export class Usuario{
    idUser:number=0
    nombres:string=""
    apellidos:string=""
    username:string=""
    dni:string=""
    edad:number=0
    genero:string=""
    distrito:string=""
    telefono:string=""
    correo:string=""
    password:string=""
    enabled:boolean=true
    rol: Rol = new Rol()
    puntosAcumulados:number=0
}
