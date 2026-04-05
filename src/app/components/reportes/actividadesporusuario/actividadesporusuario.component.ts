import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActividadesPorUsuarioDTO } from '../../../models/ActividadesPorUsuarioDTO';
import { ActividadService } from '../../../services/actividad.service';

@Component({
  selector: 'app-actividadesporusuario',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, CommonModule, MatIconModule],
  templateUrl: './actividadesporusuario.component.html',
  styleUrl: './actividadesporusuario.component.css'
})
export class ActividadesporusuarioComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['posicion', 'username', 'actividades', 'puntos'];
  dataSource = new MatTableDataSource<ActividadesPorUsuarioDTO & { rank?: number }>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private apuS: ActividadService) { }

  ngOnInit(): void {
    this.fetchActividadporUsuario();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  fetchActividadporUsuario(): void {
    this.apuS.getActividadesporUsuario().subscribe(
      (data: ActividadesPorUsuarioDTO[]) => {
        // Ordenamos para Leaderboard de Puntos
        const sorted = data.sort((a, b) => b.total_puntos - a.total_puntos);
        const rankedData = sorted.map((item, index) => ({ ...item, rank: index + 1 }));
        this.dataSource.data = rankedData;
      },
      (error) => {
        console.error('Error fetching actividad usuario data', error);
      }
    );
  }
}