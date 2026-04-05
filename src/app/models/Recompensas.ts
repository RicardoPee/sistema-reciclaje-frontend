export class Recompensas {
    idRecompensas: number = 0;
    nombreRecompensa: string = "";
    descripcionRecompensa: string = "";
    fechaVencimiento: Date = new Date(Date.now());
    costoPuntos: number = 0;
    stock: number = 100; // -1 = ilimitado, 0 = AGOTADO
}