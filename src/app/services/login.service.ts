import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtRequest } from '../models/jwtRequest';
import { JwtHelperService } from '@auth0/angular-jwt';
import { tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';


import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

  login(request: JwtRequest){
    //return this.http.post('ahttps://grupo-2arqui-production-backend.up.railway.app/login', request)
    return this.http.post(`${environment.base}/login`, request)
  }
  verificar() {
    let token = sessionStorage.getItem('token');
    return token != null;
  }
  showRole() {
    let token = sessionStorage.getItem('token');
    if (!token) {
      // Manejar el caso en el que el token es nulo.
      return null; // O cualquier otro valor predeterminado dependiendo del contexto.
    }
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    return decodedToken?.role;
  }

  getID(){
    if (typeof window !== 'undefined') {  // Verifica si está en el navegador
      let token = sessionStorage.getItem('token');
      if (!token) {
        // Manejar el caso en el que el token es nulo
        return null; // O cualquier otro valor predeterminado dependiendo del contexto
      }
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      console.log(decodedToken);
      
      let id = decodedToken?.id;
      if(id){
        id = parseInt(id);
        if (isNaN(id)){
          return null;
        }
      }
      return id;
    }
    return null;
  }
}
