import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { Reclamaciones } from '../models/Reclamaciones';
import { HttpClient } from '@angular/common/http';
import { MostClaimedRewardDTO } from '../models/MostClaimedRewardDTO';
const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class ReclamacionesService {
  private url = `${base_url}/reclamaciones`;
  private listaCambio = new Subject<Reclamaciones[]>();

  constructor(private http: HttpClient) { }
  list() {
    return this.http.get<Reclamaciones[]>(this.url);
  }
  insert(r: Reclamaciones) {
    return this.http.post(this.url, r);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  setList(listaNueva: Reclamaciones[]) {
    this.listaCambio.next(listaNueva);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  listId(id: number) {
    return this.http.get<Reclamaciones>(`${this.url}/${id}`);
  }

  update(rec: Reclamaciones) {
    return this.http.put(this.url, rec);
  }

  cantidadRecompensas():Observable<MostClaimedRewardDTO[]>{
    return this.http.get<MostClaimedRewardDTO[]>(`${this.url}/mas_reclamada`)
  }

}
