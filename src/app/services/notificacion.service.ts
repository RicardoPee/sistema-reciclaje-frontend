import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Notificaciones } from '../models/Notificaciones';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';

const base_url = environment.base;
@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  private url = `${base_url}/notificaciones`;
  private listaCambio = new Subject<Notificaciones[]>();
  constructor(private http: HttpClient) {}
  list() {
    return this.http.get<Notificaciones[]>(this.url);
  }
  insert(n: Notificaciones) {
    return this.http.post(this.url, n);
  }

  
  getList() {
    return this.listaCambio.asObservable();
  }

  setList(listaNueva: Notificaciones[]) {
    this.listaCambio.next(listaNueva);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  listId(id:number){
    return this.http.get<Notificaciones>(`${this.url}/${id}`)
  }
  
  update(noti: Notificaciones){
    return this.http.put(this.url, noti);
  }
}
