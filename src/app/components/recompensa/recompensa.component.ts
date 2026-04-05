import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarrecompensaComponent } from './listarrecompensa/listarrecompensa.component';

@Component({
  selector: 'app-recompensa',
  standalone: true,
  imports: [RouterOutlet,ListarrecompensaComponent],
  templateUrl: './recompensa.component.html',
  styleUrl: './recompensa.component.css',
})
export class RecompensaComponent {
  constructor(public route: ActivatedRoute) {}
}
