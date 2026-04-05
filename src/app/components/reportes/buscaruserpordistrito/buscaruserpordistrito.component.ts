import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Usuario } from '../../../models/Usuario';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-buscaruserpordistrito',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatPaginatorModule
  ],
  templateUrl: './buscaruserpordistrito.component.html',
  styleUrl: './buscaruserpordistrito.component.css'
})
export class BuscaruserpordistritoComponent {
  displayedColumns: string[] = ['idUser', 'nombres', 'apellidos', 'username', 'dni', 'edad','genero','distrito', 'telefono', 'correo', 'enabled', 'rol','nombrerol', 'acciones'];
  usuario: Usuario[] = [];
  distritosDisponibles: string[] = [];
  distrito: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuarioService.getUsuarios().subscribe((data) => {
      // Filtrar distritos únicos
      const unicos = [...new Set(data.map(item => item.distrito))];
      this.distritosDisponibles = unicos;
      if (this.distritosDisponibles.length > 0) {
        this.distrito = this.distritosDisponibles[0];
      }
    });
  }

  buscarDistrito() {
    if (!this.distrito) {
      alert('Por favor selecciona un distrito.');
      return;
    }
    this.usuarioService.buscarPorDistrito(this.distrito).subscribe((data) => {
      if (data.length > 0) {
        this.usuario = data;
      } else {
        alert('No se encontraron usuarios con ese nombre.');
        this.usuario = [];
      }
    }, error => {
      alert('Error al realizar la búsqueda. Intenta nuevamente.');
      this.usuario = [];
    });
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.usuarioService.delete(id).subscribe(() => {
        this.buscarDistrito();
      });
    }
  }

}
