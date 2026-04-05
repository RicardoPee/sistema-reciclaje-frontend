import { Component } from '@angular/core';
import { ListarrolesComponent } from "./listarroles/listarroles.component";
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-rol',
  standalone: true,
  imports: [ListarrolesComponent, RouterOutlet],
  templateUrl: './rol.component.html',
  styleUrl: './rol.component.css'
})
export class RolComponent {
  constructor(public route:ActivatedRoute) {}
}
