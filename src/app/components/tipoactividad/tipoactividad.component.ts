import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListartipoactividadComponent } from './listartipoactividad/listartipoactividad.component';

@Component({
  selector: 'app-tipoactividad',
  standalone: true,
  imports: [ListartipoactividadComponent,RouterOutlet],
  templateUrl: './tipoactividad.component.html',
  styleUrl: './tipoactividad.component.css'
})
export class TipoactividadComponent {
  constructor(public route:ActivatedRoute){

  }

}
