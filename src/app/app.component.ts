import { LoginService } from './services/login.service';
import { UsuarioService } from './services/usuario.service';
import { Component, OnInit } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterModule,
  RouterOutlet,
} from '@angular/router';



import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { WebsocketService } from './services/websocket.service';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CommonModule } from '@angular/common';



import { GoogleMapsModule } from '@angular/google-maps';
import { BrowserModule } from '@angular/platform-browser';
import { MatPaginatorModule } from '@angular/material/paginator';


@Component({
  selector: 'app-root',
  standalone: true,

  imports: [
    RouterOutlet,
    RouterLink,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    NgxMaterialTimepickerModule,
    CommonModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatBadgeModule
  ],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  role: string = '';
  isWelcomePage: boolean = false;
  userId: string | null = null;
  puntosUsuario: number = 0;
  isDarkMode: boolean = false;
  notificacionesNoLeidas: number = 0;

  constructor(
    private loginService: LoginService, 
    private router: Router, 
    private usuarioService: UsuarioService,
    private wsService: WebsocketService,
    private snackBar: MatSnackBar
  ) {
    // Verifica la ruta actual para mostrar u ocultar elementos
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const rootUrl = event.urlAfterRedirects.split('?')[0];
        this.isWelcomePage =
          rootUrl === '/' ||
          rootUrl === '/welcome' ||
          rootUrl === '/login' ||
          rootUrl === '/home' ||
          rootUrl.startsWith('/home/');
          
        if (!this.isWelcomePage && this.verificar() && this.isCliente()) {
           this.cargarPuntosUsuario();
        }
      }
    });
  }

  ngOnInit(): void {
    // Cargar preferencia de modo oscuro
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    this.cargarPuntosUsuario();
    this.usuarioService.getPuntosCambio().subscribe(puntos => {
      this.puntosUsuario = puntos;
    });

    // Conectar WebSocket si el usuario está logueado
    if (this.verificar()) {
      const idStr = this.loginService.getID();
      if (idStr) {
        this.wsService.connect(parseInt(idStr));
      }
    }

    // Escuchar notificaciones en tiempo real
    this.wsService.notifications$.subscribe(msg => {
      this.notificacionesNoLeidas++;
      // Mostrar Toast o alerta inferior
      this.snackBar.open(msg, 'Cerrar', {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: ['success-snackbar']
      });
      // Opcional: Recargar puntos automáticamente
      this.cargarPuntosUsuario();
    });
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }

  cargarPuntosUsuario() {
    if (this.verificar() && this.isCliente()) {
      const id = this.loginService.getID();
      if (id) {
        this.usuarioService.actualizarPuntosGlobales(parseInt(id));
      }
    }
  }

  cerrar() {
    this.wsService.disconnect();
    sessionStorage.clear();
  }

  verificar(): boolean {
    this.role = this.loginService.showRole();
    return this.loginService.verificar(); // Devuelve true si está autenticado
  }

  isAdmin() {
    return this.role === 'ADMIN';
  }

  isCliente() {
    return this.role === 'CLIENTE';
  }

  isEmpleado() {
    return this.role === 'EMPLEADO';
  }

  prueba() {
    this.userId = this.loginService.getID();
    console.log("ID del usuario:", this.userId);
  }
}

