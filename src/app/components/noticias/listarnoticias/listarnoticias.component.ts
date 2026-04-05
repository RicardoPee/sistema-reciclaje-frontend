import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Noticias } from '../../../models/Noticias';
import { NoticiasService } from '../../../services/noticias.service';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-listarnoticias',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    RouterLink,
    MatCardModule,
    MatPaginatorModule,
    CommonModule,
  ],
  templateUrl: './listarnoticias.component.html',
  styleUrls: ['./listarnoticias.component.css']
})
export class ListarnoticiasComponent implements OnInit {
 
  noticias: Noticias[] = [];
  pagedData: Noticias[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  role: string = '';

  constructor(private nS: NoticiasService, private lS: LoginService) {}

  ngOnInit(): void {
    this.role = this.lS.showRole();

    const sortDesc = (data: Noticias[]) =>
      data.sort((a, b) => b.idNoticias - a.idNoticias);

    this.nS.list().subscribe((data) => {
      this.noticias = sortDesc(data);
      this.updatePagedData();
    });
    this.nS.getList().subscribe((data) => {
      this.noticias = sortDesc(data);
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
    this.pagedData = this.noticias.slice(startIndex, endIndex);
  }
 
  eliminar(id: number) {
    this.nS.delete(id).subscribe((data) => {
      this.nS.list().subscribe((data) => {
        this.nS.setList(data);
        this.noticias = data;
        this.updatePagedData();
      });
    });
  }

  isAdmin() {
    return this.role === 'ADMI';
  }
}
