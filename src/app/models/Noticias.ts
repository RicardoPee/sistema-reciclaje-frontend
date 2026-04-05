import { CentroReciclaje } from './CentroReciclaje';

export class Noticias {
    idNoticias: number = 0;
    titulo: String = "";
    informacion: String = "";
    fechaPublicacion: Date = new Date(Date.now());
    centroReciclaje?: CentroReciclaje; // opcional: si se elige, dispara notificaciones automáticas
}