import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CentroReciclajeService } from '../../../services/centro-reciclaje.service';
import { CenterFavoriteDTO } from '../../../models/CenterFavoriteDTO';

@Component({
  selector: 'app-centrosfavoritos',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './centrosfavoritos.component.html',
  styleUrls: ['./centrosfavoritos.component.css']
})
export class CentrosfavoritosComponent implements OnInit {
  
  topCentros: CenterFavoriteDTO[] = [];

  constructor(private cS: CentroReciclajeService) {}

  ngOnInit(): void {
    this.fetchCentroFavorito();
  }

  fetchCentroFavorito(): void {
    this.cS.getFavoritos().subscribe(
      (data: CenterFavoriteDTO[]) => {
        if (data && data.length > 0) {
          // Ordenar de mayor a menor y agarrar el Top 3
          const sorted = data.sort((a, b) => b.cantidadFavoritos - a.cantidadFavoritos);
          this.topCentros = sorted.slice(0, 3);
        }
      },
      (error) => {
        console.error('Error fetching centro favorito data', error);
      }
    );
  }
}
