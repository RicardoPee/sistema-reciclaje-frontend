import { Favoritos } from './../../../models/Favoritos';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { FavoritosService } from '../../../services/favoritos.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-listarfavoritos',
  standalone: true,
  imports: [    
    MatTableModule,
    MatIconModule,
    RouterLink,
    MatCardModule,
    MatPaginatorModule,
    CommonModule ],
  templateUrl: './listarfavoritos.component.html',
  styleUrl: './listarfavoritos.component.css'
})
export class ListarfavoritosComponent implements OnInit {
 
  favoritos:Favoritos[] =[];
  pagedData: Favoritos[] = [];

  role: String = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private fS: FavoritosService, private lS: LoginService) { }

  ngOnInit(): void {
    this.role = this.lS.showRole();
  
    this.fS.list().subscribe((data) => {
      this.favoritos = data;
      this.updatePagedData(); // Asegúrate de llamar a updatePagedData cuando los datos estén disponibles
    });
    this.fS.getList().subscribe((data) => {
      this.favoritos = data;
      this.updatePagedData(); // Asegúrate de llamar a updatePagedData cuando los datos estén disponibles
    });

  }
  ngAfterViewInit(): void{
    this.paginator.page.subscribe(() => {
      this.updatePagedData();
    });
  }

  updatePagedData(): void {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    this.pagedData = this.favoritos.slice(startIndex, endIndex);
  }

  eliminar(id: number) {
    this.fS.delete(id).subscribe((data) => {
      this.fS.list().subscribe((data) => {
        this.fS.setList(data);
        this.favoritos = data;
        this.fS.updatePagedData();
      });
    });
  }

  isAdmi() {
    return this.role === 'ADMI';
  }
}
