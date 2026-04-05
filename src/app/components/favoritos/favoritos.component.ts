import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarfavoritosComponent } from './listarfavoritos/listarfavoritos.component';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [RouterOutlet, ListarfavoritosComponent],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.css'
})
export class FavoritosComponent implements OnInit{
  constructor(public route:ActivatedRoute){}
  ngOnInit(): void {
  }

}
