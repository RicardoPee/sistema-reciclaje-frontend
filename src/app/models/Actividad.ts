import { CentroReciclaje } from "./CentroReciclaje"
import { TipoActividad } from "./TipoActividad"
import { Usuario } from "./Usuario"

export class Actividad{
    idActividad:number=0
    fecha_recepcion:Date=new Date(Date.now())
    puntos: number = 0
    cantidad: number = 0
    estado: string = 'PENDIENTE'
    codigoReserva: string = ''
    ta:TipoActividad=new TipoActividad()
    cr:CentroReciclaje=new CentroReciclaje()
    u:Usuario=new Usuario()
}