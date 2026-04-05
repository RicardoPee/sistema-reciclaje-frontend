import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { TipoActividad } from '../models/TipoActividad';
import { Subject } from 'rxjs';
const base_url=environment.base
@Injectable({
  providedIn: 'root'
})
export class TipoactividadService {
  private url=`${base_url}/tipodeactividades`
  private listaCambio= new Subject<TipoActividad[]>()
  constructor(private http:HttpClient) { }
  list(){
    return this.http.get<TipoActividad[]>(this.url)
  }
  insert(tac:TipoActividad){
   return this.http.post(this.url, tac)
  }
  setList(ListaNueva:TipoActividad[]){
    this.listaCambio.next(ListaNueva)
  }
  getList(){
    return this.listaCambio.asObservable();
  }
  delete(id:number){
    return this.http.delete(`${this.url}/${id}`);
  }
  listId(id:number){
    return this.http.get<TipoActividad>(`${this.url}/${id}`);
  }
  update(tact: TipoActividad){
    return this.http.put(this.url, tact)
  }
}
