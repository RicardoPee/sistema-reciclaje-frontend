import { CommonModule } from '@angular/common';
import { ListarnoticiasComponent } from './listarnoticias/listarnoticias.component';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [RouterOutlet, ListarnoticiasComponent,CommonModule],
  templateUrl: './noticias.component.html',
  styleUrl: './noticias.component.css'
})
export class NoticiasComponent {
  constructor(public route: ActivatedRoute) { 

  }
}
