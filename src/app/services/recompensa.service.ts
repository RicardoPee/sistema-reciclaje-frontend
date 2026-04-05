import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Recompensas } from '../models/Recompensas';
import { Observable, Subject } from 'rxjs';
import { MostClaimedRewardDTO } from '../models/MostClaimedRewardDTO';
import { CloseToExpireDTO } from '../models/CloseToExpireDTO';
const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class RecompensaService {
  private url = `${base_url}/recompensas`;
  private listaCambio = new Subject<Recompensas[]>();

  constructor(private http: HttpClient) { }
  list() {
    return this.http.get<Recompensas[]>(this.url);
  }
  insert(r: Recompensas) {
    return this.http.post(this.url, r);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  setList(listaNueva: Recompensas[]) {
    this.listaCambio.next(listaNueva);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  listId(id: number) {
    return this.http.get<Recompensas>(`${this.url}/${id}`);
  }

  update(rec: Recompensas) {
    return this.http.put(this.url, rec);
  }

  proximoVencimiento():Observable<CloseToExpireDTO[]>{
    return this.http.get<CloseToExpireDTO[]>(`${this.url}/proxvencer`)
  }

}