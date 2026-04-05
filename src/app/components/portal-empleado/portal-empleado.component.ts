import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Actividad } from '../../models/Actividad';
import { ActividadService } from '../../services/actividad.service';

@Component({
  selector: 'app-portal-empleado',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatTableModule, MatPaginatorModule, MatIconModule,
    MatButtonModule, MatInputModule, MatFormFieldModule, MatSnackBarModule
  ],
  templateUrl: './portal-empleado.component.html',
  styleUrl: './portal-empleado.component.css'
})
export class PortalEmpleadoComponent implements OnInit {

  displayedColumns: string[] = ['codigo', 'usuario', 'centro', 'tipoActividad', 'cantidad', 'puntos', 'fecha', 'acciones'];
  dataSource = new MatTableDataSource<Actividad>();
  filtroCodigo: string = '';
  cargando: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private aS: ActividadService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.cargarPendientes();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  cargarPendientes(): void {
    this.cargando = true;
    this.aS.list().subscribe((data: Actividad[]) => {
      // Solo mostrar PENDIENTES
      this.dataSource.data = data.filter(a => a.estado === 'PENDIENTE');
      this.cargando = false;
    });
  }

  filtrar(): void {
    const codigo = this.filtroCodigo.trim().toUpperCase();
    this.aS.list().subscribe((data: Actividad[]) => {
      let pendientes = data.filter(a => a.estado === 'PENDIENTE');
      if (codigo) {
        pendientes = pendientes.filter(a => a.codigoReserva?.toUpperCase().includes(codigo));
      }
      this.dataSource.data = pendientes;
    });
  }

  aprobar(id: number): void {
    if (!confirm('¿Confirmar APROBACIÓN? Se acreditarán los puntos al usuario.')) return;
    this.aS.aprobar(id).subscribe({
      next: () => {
        this.snackBar.open('✅ Actividad aprobada. Puntos acreditados.', 'Cerrar', { duration: 3500, panelClass: ['snack-success'] });
        this.cargarPendientes();
      },
      error: (err) => this.snackBar.open('Error: ' + err.error, 'Cerrar', { duration: 4000 })
    });
  }

  rechazar(id: number): void {
    if (!confirm('¿Confirmar RECHAZO? No se acreditarán puntos.')) return;
    this.aS.rechazar(id).subscribe({
      next: () => {
        this.snackBar.open('❌ Actividad rechazada.', 'Cerrar', { duration: 3000 });
        this.cargarPendientes();
      },
      error: (err) => this.snackBar.open('Error: ' + err.error, 'Cerrar', { duration: 4000 })
    });
  }
}
