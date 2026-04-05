import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from'@angular/material/table';
import { TipoActividad } from '../../../models/TipoActividad';
import { TipoactividadService } from '../../../services/tipoactividad.service';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listartipoactividad',
  standalone: true,
  imports: [MatTableModule,MatIconModule,RouterLink,MatPaginatorModule, CommonModule],
  templateUrl: './listartipoactividad.component.html',
  styleUrl: './listartipoactividad.component.css'
})

export class ListartipoactividadComponent implements OnInit{
  dataSource = new MatTableDataSource<TipoActividad>();
  displayedColumns: string[] = ['c1', 'c2', 'accion01', 'accion02'];


  constructor(private taS: TipoactividadService) {}

  ngOnInit(): void {
    this.taS.list().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
    });
    this.taS.getList().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
    });
  }


  eliminar(id: number): void {
    this.taS.delete(id).subscribe((data) => {
      this.taS.list().subscribe(data => {
        this.taS.setList(data);
        this.dataSource.data = data; // Actualiza los datos
      });
      
    },
    (error) => { console.error('Error al eliminar:', error); });
  }

}
