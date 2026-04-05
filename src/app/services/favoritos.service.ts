import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Favoritos } from '../models/Favoritos';
const base_url=environment.base;

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  updatePagedData() {
    throw new Error('Method not implemented.');
  }
  private url = `${base_url}/favoritos`; 
  private listaCambio= new Subject<Favoritos[]>()

  constructor(private http:HttpClient) { }
  list(){
    return this.http.get<Favoritos[]>(this.url)
  }
  insert(fav:Favoritos){
    return this.http.post(this.url, fav)
  }
  setList(ListaNueva:Favoritos[]){
    this.listaCambio.next(ListaNueva)
  }
  getList()
  {
    return this.listaCambio.asObservable();
  }
  delete(id:number){
    return this.http.delete(`${this.url}/${id}`);
  }

  listId(id:number){
    return this.http.get<Favoritos>(`${this.url}/${id}`);
  }

  update(fa: Favoritos){
    return this.http.put(this.url, fa);
  }


}
