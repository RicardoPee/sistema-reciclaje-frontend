import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Noticias } from '../models/Noticias';
import { Subject } from 'rxjs';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {
  private url = `${base_url}/noticias`;
  private listaCambio = new Subject<Noticias[]>();

  constructor(private http: HttpClient) {  }

  
    list() {
      return this.http.get<Noticias[]>(this.url); 
    }

    insert(n: Noticias) {
      return this.http.post(this.url, n);
    }
  
    getList() {
      return this.listaCambio.asObservable();
    }
  
    setList(listaNueva: Noticias[]) {
      this.listaCambio.next(listaNueva);
    }
  
    delete(id: number) {
      return this.http.delete(`${this.url}/${id}`);
    }
  
    listId(id: number) {
      return this.http.get<Noticias>(`${this.url}/${id}`);
    }
  
    update(noti: Noticias) {
      return this.http.put(this.url, noti);
    }
}
