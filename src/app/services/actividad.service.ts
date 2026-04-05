import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Actividad } from '../models/Actividad';
import { Observable, Subject } from 'rxjs';
import { ActividadesPorCentroDTO } from '../models/ActividadesPorCentroDTO';
import { ActividadesPorUsuarioDTO } from '../models/ActividadesPorUsuarioDTO';
const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class ActividadService {
  private url = `${base_url}/actividad`;
  private listaCambio = new Subject<Actividad[]>();

  constructor(private http: HttpClient) {}

  list(): Observable<Actividad[]> {
    return this.http.get<Actividad[]>(this.url);
  }

  /** POST devuelve el objeto completo con codigoReserva generado */
  insert(ac: Actividad): Observable<Actividad> {
    return this.http.post<Actividad>(this.url, ac);
  }

  setList(listaNueva: Actividad[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  listId(id: number): Observable<Actividad> {
    return this.http.get<Actividad>(`${this.url}/${id}`);
  }

  update(act: Actividad) {
    return this.http.put(this.url, act);
  }

  /** NUEVO: Aprobar actividad PENDIENTE (EMPLEADO/ADMI) */
  aprobar(id: number): Observable<string> {
    return this.http.put(`${this.url}/${id}/aprobar`, {}, { responseType: 'text' });
  }

  /** NUEVO: Rechazar actividad PENDIENTE (EMPLEADO/ADMI) */
  rechazar(id: number): Observable<string> {
    return this.http.put(`${this.url}/${id}/rechazar`, {}, { responseType: 'text' });
  }

  getActividadesporCentro(): Observable<ActividadesPorCentroDTO[]> {
    return this.http.get<ActividadesPorCentroDTO[]>(`${this.url}/ActividadesPorCentro`);
  }

  getActividadesporUsuario(): Observable<ActividadesPorUsuarioDTO[]> {
    return this.http.get<ActividadesPorUsuarioDTO[]>(`${this.url}/ActividadesPorUsuario`);
  }

  getRankingDistrito(distrito: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/ranking/distrito`, { params: { distrito } });
  }
}

