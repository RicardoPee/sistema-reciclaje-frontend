import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarusuarioComponent } from './listarusuario/listarusuario.component';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [RouterOutlet, ListarusuarioComponent],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css',
})
export class UsuarioComponent {
  constructor(public route:ActivatedRoute) {}
}
