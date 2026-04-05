import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Recompensas } from '../../../models/Recompensas';
import { RecompensaService } from '../../../services/recompensa.service';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../services/login.service';
import { ReclamacionesService } from '../../../services/reclamaciones.service';
import { Reclamaciones } from '../../../models/Reclamaciones';
import { Usuario } from '../../../models/Usuario';
import { UsuarioService } from '../../../services/usuario.service';
import { MatButtonModule } from '@angular/material/button';
import { Notificaciones } from '../../../models/Notificaciones';
import { NotificacionService } from '../../../services/notificacion.service';

@Component({
  selector: 'app-listarrecompensa',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    RouterLink,
    MatCardModule,
    MatPaginatorModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './listarrecompensa.component.html',
  styleUrls: ['./listarrecompensa.component.css']
})
export class ListarrecompensaComponent implements OnInit {
  recompensas: Recompensas[] = [];
  pagedData: Recompensas[] = [];
  Math = Math; // exponer para el template

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  role: string = '';

  constructor(
    private rS: RecompensaService,
    private lS: LoginService,
    private router: Router,
    private reclamacionesService: ReclamacionesService,
    private usuarioService: UsuarioService,
    private notificacionService: NotificacionService
  ) {}

  ngOnInit(): void {
    this.role = this.lS.showRole();

    this.rS.list().subscribe((data) => {
      this.recompensas = data;
      this.updatePagedData();
    });
    this.rS.getList().subscribe((data) => {
      this.recompensas = data;
      this.updatePagedData();
    });
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe(() => {
      this.updatePagedData();
    });
  }

  updatePagedData(): void {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    this.pagedData = this.recompensas.slice(startIndex, endIndex);
  }

  eliminar(id: number) {
    this.rS.delete(id).subscribe(() => {
      this.rS.list().subscribe((data) => {
        this.rS.setList(data);
        this.recompensas = data;
        this.updatePagedData();
      });
    });
  }  
  
  reclamarRecompensa(recompensa: Recompensas) {
    if (confirm('¿Estás seguro de que deseas canjear esta recompensa?')) {
      let reclamacion = new Reclamaciones();
      reclamacion.recompensa.idRecompensas = recompensa.idRecompensas;
      
      const userId = this.lS.getID();
      if (userId) {
        reclamacion.usuario.idUser = parseInt(userId);
      }

      this.reclamacionesService.insert(reclamacion).subscribe({
        next: () => {
          alert('¡Canje exitoso! Disfruta tu recompensa ecológica.');
          
          // Generar notificación en el sistema con código y nombre
          let miNoti = new Notificaciones();
          const codigo = "RCL-" + Math.floor(10000 + Math.random() * 90000);
          miNoti.mensaje = `¡Gracias por reciclar! Acércate a reclamar "${recompensa.nombreRecompensa}". Tu código es: ${codigo}`;
          miNoti.fecha = new Date();
          // Vincular la notificación al usuario logueado
          if (userId) {
            miNoti.us = new Usuario();
            miNoti.us.idUser = parseInt(userId);
          }
          
          this.notificacionService.insert(miNoti).subscribe(() => {
             // Refrescar los puntos en vivo (delay breve para darle chance a la BD de actualizar)
             if (userId) {
               setTimeout(() => {
                 this.usuarioService.actualizarPuntosGlobales(parseInt(userId!));
               }, 300);
             }
          });
        },
        error: (err) => {
          alert('¡Ups! No tienes puntos suficientes para canjear esta recompensa o ha ocurrido un error.');
        }
      });
    }
  }

  isCliente(): boolean {
    return this.role == 'CLIENTE';
  }

  isAdmi(): boolean {
    return this.role == 'ADMI';
  }
}
