import { Injectable } from '@angular/core';
import { Usuario } from '../models/Usuario';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { CantidadNotiUsuarioDTO } from '../models/CantidadNotiUsuarioDTO';
import { LoginComponent } from '../components/login/login.component';
import { LoginService } from './login.service';
import { ObtenerCantidadUsuariosPorDistritoDTO } from '../models/ObtenerCantidadUsuariosPorDistritoDTO';
const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private url = `${base_url}/usuarios`;
  private listaCambio = new Subject<Usuario[]>();
  private puntosCambio = new Subject<number>();

  constructor(private http: HttpClient, private login:LoginService) {}
  list() {
    return this.http.get<Usuario[]>(this.url);
  }

  insert(u: Usuario) {
    return this.http.post(this.url, u);
  }

  
  getList() {
    return this.listaCambio.asObservable();
  }

  setList(listaNueva: Usuario[]) {
    this.listaCambio.next(listaNueva);
  }

  getPuntosCambio() {
    return this.puntosCambio.asObservable();
  }

  setPuntosCambio(puntos: number) {
    this.puntosCambio.next(puntos);
  }

  actualizarPuntosGlobales(id: number) {
    this.listId(id).subscribe(user => {
      this.setPuntosCambio(user.puntosAcumulados);
    });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  listId(id:number){
    return this.http.get<Usuario>(`${this.url}/${id}`)
  }
  
  update(usu: Usuario){
    return this.http.put(this.url, usu);
  }

  getUsuarioNoti(): Observable<CantidadNotiUsuarioDTO[]> {
    return this.http.get<CantidadNotiUsuarioDTO[]>(`${this.url}/conteo_notificaciones_rangoHoras`);
  }

  buscarPorDistrito(distrito: string): Observable<Usuario[]> {
    const params = new HttpParams().set('distrito', distrito);
    return this.http.get<Usuario[]>(`${this.url}/busquedas`, { params });
  }
  getUsuarios(): Observable<ObtenerCantidadUsuariosPorDistritoDTO[]> {
    return this.http.get<ObtenerCantidadUsuariosPorDistritoDTO[]>(`${this.url}/obtenercantidadUsuariosporDistrito`);
  }
}
