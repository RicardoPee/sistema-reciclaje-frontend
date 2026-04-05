import { Component } from '@angular/core';
import { ListarreclamacionesComponent } from "./listarreclamaciones/listarreclamaciones.component";
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-reclamaciones',
  standalone: true,
  imports: [RouterOutlet,ListarreclamacionesComponent],
  templateUrl: './reclamaciones.component.html',
  styleUrl: './reclamaciones.component.css'
})
export class ReclamacionesComponent {
  constructor(public route: ActivatedRoute) {}
}
