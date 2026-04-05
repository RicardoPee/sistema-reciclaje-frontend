import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Notificaciones } from '../../../models/Notificaciones';
import { NotificacionService } from '../../../services/notificacion.service';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-listarnotificacion',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    RouterLink,
    MatCardModule,
    MatPaginatorModule,
    CommonModule,
  ],
  templateUrl: './listarnotificacion.component.html',
  styleUrl: './listarnotificacion.component.css',
})
export class ListarnotificacionComponent implements OnInit {
  dataSource: MatTableDataSource<Notificaciones> = new MatTableDataSource();
  notificaciones: Notificaciones[] = [];
  pagedData: Notificaciones[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  role: string = '';
  leidas: Set<number> = new Set<number>();

  constructor(private nS: NotificacionService, private lS: LoginService) {}
  ngOnInit(): void {
    this.role = this.lS.showRole();
    const myId = this.lS.getID(); // can be number or null
    const myIdStr = myId != null ? String(myId) : null;

    const filtrar = (data: Notificaciones[]) => {
      if (this.isAdmi()) return data;
      if (!myIdStr) return [];
      // Sin us = notificacion global (para todos los clientes)
      // Con us = solo para ese usuario específico
      return data.filter(n => n.us == null || String(n.us?.idUser) === myIdStr);
    };

    this.nS.list().subscribe((data) => {
      this.notificaciones = filtrar(data).sort((a,b) => b.idNotificaciones - a.idNotificaciones);
      this.updatePagedData();
    });
    this.nS.getList().subscribe((data) => {
      this.notificaciones = filtrar(data).sort((a,b) => b.idNotificaciones - a.idNotificaciones);
      this.updatePagedData();
    });
  }

  ngAfterViewInit(): void {
    // Actualizar los datos cuando se cambia de página
    this.paginator.page.subscribe(() => {
      this.updatePagedData();
    });
  }

  // Función para actualizar los datos según la página actual
  updatePagedData(): void {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    this.pagedData = this.notificaciones.slice(startIndex, endIndex);
  }
  eliminar(id: number) {
    if (this.isAdmi()) {
      this.nS.delete(id).subscribe((data) => {
        this.nS.list().subscribe((data) => {
          this.nS.setList(data);
          this.notificaciones = data.sort((a,b) => b.idNotificaciones - a.idNotificaciones);
          this.updatePagedData();
        });
      });
    } else {
      // Cliente borra de su vista
      this.notificaciones = this.notificaciones.filter(n => n.idNotificaciones !== id);
      this.updatePagedData();
    }
  }

  marcarTodoComoLeido() {
    this.notificaciones.forEach(n => this.leidas.add(n.idNotificaciones));
  }

  marcarComoLeido(id: number) {
    this.leidas.add(id);
  }

  isLeido(id: number): boolean {
    return this.leidas.has(id);
  }

  eliminarTodas() {
    if (confirm("¿Estás seguro de limpiar TODA tu bandeja de notificaciones?")) {
      this.notificaciones = [];
      this.updatePagedData();
    }
  }

  isAdmi(): boolean {
    return this.role === 'ADMI';
  }
}
