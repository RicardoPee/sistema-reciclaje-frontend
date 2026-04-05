import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Rol } from '../../../models/Rol';
import { RolService } from '../../../services/rol.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listarroles',
  standalone: true,
  imports: [MatTableModule, MatIconModule, RouterLink, CommonModule],
  templateUrl: './listarroles.component.html',
  styleUrl: './listarroles.component.css',
})
export class ListarrolesComponent implements OnInit {
  dataSource: MatTableDataSource<Rol> = new MatTableDataSource();

  displayedColumns: string[] = ['c1', 'c2','accion01', 'accion02'];

  constructor(private rS: RolService) {}

  ngOnInit(): void {
    this.rS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
    this.rS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id: number) {
    this.rS.delete(id).subscribe((data) => {
      this.rS.list().subscribe((data) => {
        this.rS.setList(data);
      });
    });
  }
}
