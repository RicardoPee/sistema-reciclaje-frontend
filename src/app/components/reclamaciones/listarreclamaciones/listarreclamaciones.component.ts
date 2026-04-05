import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Reclamaciones } from '../../../models/Reclamaciones';
import { ReclamacionesService } from '../../../services/reclamaciones.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-listarreclamaciones',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    RouterLink,
    MatCardModule,
    MatPaginatorModule,
    CommonModule,
  ],
  templateUrl: './listarreclamaciones.component.html',
  styleUrls: ['./listarreclamaciones.component.css']
})
export class ListarreclamacionesComponent implements OnInit, AfterViewInit {
  reclamaciones: Reclamaciones[] = [];
  pagedData: Reclamaciones[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  role: String = '';
  constructor(private rS: ReclamacionesService, private ls: LoginService) {}

  ngOnInit(): void {
    this.role = this.ls.showRole();
  
    this.rS.list().subscribe((data) => {
      this.reclamaciones = data;
      this.updatePagedData(); // Asegúrate de llamar a updatePagedData cuando los datos estén disponibles
    });
    this.rS.getList().subscribe((data) => {
      this.reclamaciones = data;
      this.updatePagedData(); // Asegúrate de llamar a updatePagedData cuando los datos estén disponibles
    });
  
    // this.rS.listId().subscribe((data) => {
    //   this.reclamaciones = [data];
    // this.updatePagedData(); /
    // });
  }

  ngAfterViewInit(): void{
    this.paginator.page.subscribe(() => {
      this.updatePagedData();
    });
  }

  updatePagedData(): void {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    this.pagedData = this.reclamaciones.slice(startIndex, endIndex);
  }

  eliminar(id: number) : void{
    this.rS.delete(id).subscribe(() => {
      this.rS.list().subscribe((data) => {
        this.rS.setList(data);
        this.reclamaciones = data;
        this.updatePagedData();
      });
    });
  }

  isAdmi() {
    return this.role === 'ADMI';
  }
}
