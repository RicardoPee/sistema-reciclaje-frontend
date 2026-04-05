import { Routes } from '@angular/router';

import { UsuarioComponent } from './components/usuario/usuario.component';
import { creareditarusuarioComponent } from './components/usuario/creareditarusuario/creareditarusuario.component';
import { NotificacionComponent } from './components/notificacion/notificacion.component';
import { CreareditarnotificacionComponent } from './components/notificacion/creareditarnotificacion/creareditarnotificacion.component';

import { CreareditarnoticiasComponent } from './components/noticias/creareditarnoticias/creareditarnoticias.component';
import { NoticiasComponent } from './components/noticias/noticias.component';
import { CentroReciclajeComponent } from './components/centro-reciclaje/centro-reciclaje.component';
import { CreareditarcentroreciclajeComponent } from './components/centro-reciclaje/creareditarcentroreciclaje/creareditarcentroreciclaje.component';

import { RecompensaComponent } from './components/recompensa/recompensa.component';
import { CreareditarrecompensaComponent } from './components/recompensa/creareditarrecompensa/creareditarrecompensa.component';

import { ActividadComponent } from './components/actividad/actividad.component';
import { CreaeditaactividadComponent } from './components/actividad/creaeditaactividad/creaeditaactividad.component';
import { TipoactividadComponent } from './components/tipoactividad/tipoactividad.component';
import { CreaeditatipoactividadComponent } from './components/tipoactividad/creaeditatipoactividad/creaeditatipoactividad.component';

import { RolComponent } from './components/rol/rol.component';
import { CreareditarrolesComponent } from './components/rol/creareditarroles/creareditarroles.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { ActividadesporcentroComponent } from './components/reportes/actividadesporcentro/actividadesporcentro.component';

import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { seguridadGuard } from './guard/seguridad.guard';

import { CentrosfavoritosComponent } from './components/reportes/centrosfavoritos/centrosfavoritos.component';
import { CentrosusuariosComponent } from './components/reportes/centrosusuarios/centrosusuarios.component';
import { ActividadesporusuarioComponent } from './components/reportes/actividadesporusuario/actividadesporusuario.component';
import { CantidadnotiusuarioComponent } from './components/reportes/cantidadnotiusuario/cantidadnotiusuario.component';

import { RecompensasmasreclamadasComponent } from './components/reportes/recompensasmasreclamadas/recompensasmasreclamadas.component';
import { RecompensasproxvencerComponent } from './components/reportes/recompensasproxvencer/recompensasproxvencer.component';
import { ReclamacionesComponent } from './components/reclamaciones/reclamaciones.component';
import { CreareditarreclamacionesComponent } from './components/reclamaciones/creareditarreclamaciones/creareditarreclamaciones.component';
import { BuscaruserpordistritoComponent } from './components/reportes/buscaruserpordistrito/buscaruserpordistrito.component';
import { ObtenercantidadusuariospordistritoComponent } from './components/reportes/obtenercantidadusuariospordistrito/obtenercantidadusuariospordistrito.component';
import { CreareditarfavoritosComponent } from './components/favoritos/creareditarfavoritos/creareditarfavoritos.component';
import { FavoritosComponent } from './components/favoritos/favoritos.component';
import { PortalEmpleadoComponent } from './components/portal-empleado/portal-empleado.component';
import { DashboardClienteComponent } from './components/dashboard-cliente/dashboard-cliente.component';


export const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomeComponent
  },

  {
    path: 'usuarios',
    component: UsuarioComponent,
    children: [
      {
        path: 'nuevo',
        component: creareditarusuarioComponent,
      },
      {
        path: 'ediciones/:id',
        component: creareditarusuarioComponent,
      },
      {
        path: 'reportes',
        component: ReportesComponent,
        children: [
          {
            path: 'busquedas',
            component: BuscaruserpordistritoComponent, //FFF
          },
          {
            path: 'obtenercantidadUsuariosporDistrito',
            component: ObtenercantidadusuariospordistritoComponent,
          },
        ],
      },
    ],
    canActivate: [seguridadGuard], // solo construcciones, se debe agregar a cada uno
  },
  {
    path: 'notificaciones',
    component: NotificacionComponent,
    children: [
      {
        path: 'nuevo',
        component: CreareditarnotificacionComponent,
      },
      {
        path: 'ediciones/:id',
        component: CreareditarnotificacionComponent,
      },
    ],
    canActivate: [seguridadGuard], // solo construcciones, se debe agregar a cada uno
  },
  {
    path: 'noticias',
    component: NoticiasComponent,
    children: [
      {
        path: 'nuevo',
        component: CreareditarnoticiasComponent,
      },
      {
        path: 'ediciones/:id',
        component: CreareditarnoticiasComponent,
      },
    ],
    canActivate: [seguridadGuard], // solo construcciones, se debe agregar a cada uno
  },
  {
    path: 'centroreciclaje',
    component: CentroReciclajeComponent,
    children: [
      {
        path: 'nuevo',
        component: CreareditarcentroreciclajeComponent,
      },
      {
        path: 'ediciones/:id',
        component: CreareditarcentroreciclajeComponent,
      },
      {
        path: 'reportes',
        component: ReportesComponent,
        children: [
          {
            path: 'mas_popular',
            component: CentrosfavoritosComponent,
          },
          {
            path: 'mas-usuarios',
            component: CentrosusuariosComponent,
          },
        ],
      },
    ],
    canActivate: [seguridadGuard], // solo construcciones, se debe agregar a cada uno
  },
  {
    path: 'recompensas',
    component: RecompensaComponent,
    children: [
      {
        path: 'nuevo',
        component: CreareditarrecompensaComponent,
      },
      {
        path: 'ediciones/:id',
        component: CreareditarrecompensaComponent,
      },
      {
        path: 'reportes',
        component: ReportesComponent,
        children: [
          {
            path: 'cantidadrecompensas',
            component: RecompensasmasreclamadasComponent,
          },
          {
            path: 'proxvencer',
            component: RecompensasproxvencerComponent,
          },
        ],
      },
    ],
    canActivate: [seguridadGuard], // solo construcciones, se debe agregar a cada uno
  },
  {
    path: 'reclamaciones',
    component: ReclamacionesComponent,
    children: [
      {
        path: 'nuevo',
        component: CreareditarreclamacionesComponent,
      },
      {
        path: 'ediciones/:id',
        component: CreareditarreclamacionesComponent,
      },
    ],
    canActivate: [seguridadGuard], // solo construcciones, se debe agregar a cada uno
  },
  {
    path: 'actividades',
    component: ActividadComponent,
    children: [
      {
        path: 'nuevo',
        component: CreaeditaactividadComponent,
      },
      {
        path: 'ediciones/:id',
        component: CreaeditaactividadComponent,
      },
      {
        path: 'reportes',
        component: ReportesComponent,
        children: [
          {
            path: 'actividadesporcentro',
            component: ActividadesporcentroComponent,
          },
          {
            path: 'actividadesporusuario',
            component: ActividadesporusuarioComponent,
          },
        ],
      },
    ],
    canActivate: [seguridadGuard], // solo construcciones, se debe agregar a cada uno
  },
  {
    path: 'tipodeactividades',
    component: TipoactividadComponent,
    children: [
      {
        path: 'nuevo',
        component: CreaeditatipoactividadComponent,
      },
      {
        path: 'ediciones/:id',
        component: CreaeditatipoactividadComponent,
      },
    ],
    canActivate: [seguridadGuard], // solo construcciones, se debe agregar a cada uno
  },
  {
    path: 'roles',
    component: RolComponent,
    children: [
      {
        path: 'nuevo',
        component: CreareditarrolesComponent,
      },
      {
        path: 'ediciones/:id',
        component: CreareditarrolesComponent,
      },
    ],
    canActivate: [seguridadGuard], // solo construcciones, se debe agregar a cada uno
  },
  {
    path: 'homes',
    component: HomeComponent,
    canActivate: [seguridadGuard], // solo construcciones, se debe agregar a cada uno
  },
  {
    path: 'favoritos', component: FavoritosComponent,
    children: [
      {
        path: 'nuevo', component: CreareditarfavoritosComponent,
      },
      {
        path: 'ediciones/:id', component: CreareditarfavoritosComponent, 
      }
    ],
    canActivate: [seguridadGuard],
  },
  {
    path: 'empleado/pendientes',
    component: PortalEmpleadoComponent,
    canActivate: [seguridadGuard],
  },
  {
    path: 'dashboard',
    component: DashboardClienteComponent,
    canActivate: [seguridadGuard],
  }
];
