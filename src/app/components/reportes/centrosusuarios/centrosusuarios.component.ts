import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CenterUsersDTO } from '../../../models/CenterUsersDTO';
import { CentroReciclajeService } from '../../../services/centro-reciclaje.service';

@Component({
  selector: 'app-centrosusuarios',
  standalone: true,
  imports:  [CommonModule, MatIconModule],
  templateUrl: './centrosusuarios.component.html',
  styleUrl: './centrosusuarios.component.css'
})
export class CentrosusuariosComponent implements OnInit {

  topVisitados: CenterUsersDTO[] = [];
  
  constructor(private cS: CentroReciclajeService){}
  
  ngOnInit(): void {
    this.fetchCentroUsuario();
  }

  fetchCentroUsuario():void{
    this.cS.getUsuarios().subscribe((data: CenterUsersDTO[]) => {
      if(data && data.length > 0) {
        const sorted = data.sort((a,b) => b.username - a.username);
        this.topVisitados = sorted.slice(0, 3);
      }
    });
  } 
}
