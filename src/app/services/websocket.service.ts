import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private client: Client;
  private notificationSubject = new Subject<string>();

  // Exponemos el observable para que los componentes se suscriban
  public notifications$ = this.notificationSubject.asObservable();

  constructor() {
    this.client = new Client({
      webSocketFactory: () => {
        // Usa la URL de tu backend
        // Si está en producción (environment.base), agrega /ws
        // Para SockJS, debe ser http:// o https://
        let wsUrl = environment.base + '/ws';
        return new SockJS(wsUrl);
      },
      debug: (msg: string) => console.log('STOMP: ', msg),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    this.client.onConnect = (frame) => {
      console.log('Conectado al WebSocket: ' + frame);
    };

    this.client.onStompError = (frame) => {
      console.error('Broker reportó error: ' + frame.headers['message']);
      console.error('Detalles: ' + frame.body);
    };
  }

  public connect(userId: number) {
    if (this.client.active) {
      return; // Ya está conectado
    }
    
    // Al conectar, definimos la suscripción a su canal privado
    this.client.onConnect = (frame) => {
      console.log('Conectado al WebSocket con ID: ' + userId);
      this.client.subscribe(`/topic/notificaciones/${userId}`, (message: Message) => {
        if (message.body) {
          // Emitimos el mensaje recibido a la app
          this.notificationSubject.next(message.body);
        }
      });
    };

    this.client.activate();
  }

  public disconnect() {
    if (this.client.active) {
      this.client.deactivate();
      console.log('Desconectado del WebSocket');
    }
  }
}
