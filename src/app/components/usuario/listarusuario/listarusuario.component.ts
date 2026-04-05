import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Usuario } from '../../../models/Usuario';
import { UsuarioService } from '../../../services/usuario.service';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-listarusuario',
  standalone: true,

  imports: [MatTableModule,
    CommonModule,
    RouterLink,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatPaginatorModule, MatCardModule],
  templateUrl: './listarusuario.component.html',
  styleUrls: ['./listarusuario.component.css']
})
export class ListarusuarioComponent implements OnInit {
  usuarios: Usuario[] = [];
  pagedData: Usuario[] = [];
  dataSource: MatTableDataSource<Usuario> = new MatTableDataSource();


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  role:String='';

  constructor(private uS: UsuarioService, private cdr: ChangeDetectorRef, private lS:LoginService) { }

  ngOnInit(): void {
    const userId = this.lS.getID(); 
    this.role = this.lS.showRole(); 
  
    if (this.role === 'ADMI') {
      this.uS.list().subscribe((usuarios) => {
        this.usuarios = usuarios;
        this.updatePagedData();
      });
    } else if (this.role === 'CLIENTE' && userId) {
      this.uS.listId(userId).subscribe((usuario) => {
        this.dataSource.data = [usuario]; 
      });
    } else {
      console.error('No se pudo obtener el rol o ID del usuario');
    }
    this.uS.getList().subscribe((data) => {
      this.usuarios = data;
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
    this.pagedData = this.usuarios.slice(startIndex, endIndex);
  }


  eliminar(id: number) {
    this.uS.delete(id).subscribe((data) => {
      this.uS.list().subscribe((data) => {
        this.uS.setList(data);
        this.dataSource.data = data;
        this.updatePagedData();
      });
    });
  }

  isAdmi(): boolean {
    return this.role === 'ADMI';
  }

  getRango(puntos: number): string {
    if (puntos < 100) return '🌱 Aprendiz Verde';
    if (puntos < 300) return '🥉 Bronce';
    if (puntos < 700) return '🥈 Plata';
    if (puntos < 1500) return '🥇 Oro';
    return '💎 Platino';
  }
}