import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CantidadNotiUsuarioDTO } from '../../../models/CantidadNotiUsuarioDTO';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-cantidadnotiusuario',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatIcon],
  templateUrl: './cantidadnotiusuario.component.html',
  styleUrl: './cantidadnotiusuario.component.css'
})
export class CantidadnotiusuarioComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['nombres','cantidadNotif'];
  dataSource: MatTableDataSource<CantidadNotiUsuarioDTO> = new MatTableDataSource();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  constructor(private uS: UsuarioService){}
  ngOnInit(): void {
    this.fetchNotiUsuario();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  fetchNotiUsuario():void{
    this.uS.getUsuarioNoti().subscribe(
      (data: CantidadNotiUsuarioDTO[]) => {
        this.dataSource.data = data;
      },
      (error) =>{
        console.error('Error fetching center data', error)
      }
    );
   } 
}
