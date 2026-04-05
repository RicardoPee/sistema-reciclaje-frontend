import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarcentroreciclajeComponent } from './listarcentroreciclaje/listarcentroreciclaje.component';

@Component({
  selector: 'app-centro-reciclaje',
  standalone: true,
  imports: [RouterOutlet, ListarcentroreciclajeComponent],
  templateUrl: './centro-reciclaje.component.html',
  styleUrl: './centro-reciclaje.component.css'
})
export class CentroReciclajeComponent {
  constructor(public route: ActivatedRoute) { }
}
