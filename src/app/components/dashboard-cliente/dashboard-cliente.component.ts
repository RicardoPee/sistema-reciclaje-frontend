import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { ActividadService } from '../../services/actividad.service';
import { LoginService } from '../../services/login.service';
import { Usuario } from '../../models/Usuario';
import { RankingDistritoDTO } from '../../models/RankingDistritoDTO';

@Component({
  selector: 'app-dashboard-cliente',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './dashboard-cliente.component.html',
  styleUrl: './dashboard-cliente.component.css'
})
export class DashboardClienteComponent implements OnInit {

  usuario: Usuario = new Usuario();
  ranking: RankingDistritoDTO[] = [];
  cargando: boolean = true;

  // Métricas ecológicas calculadas
  puntos: number = 0;
  arbolesSalvados: number = 0;
  co2Evitado: number = 0;   // kg
  plasticoReciclado: number = 0; // kg

  // Rango según puntos
  rango: string = '';
  rangoColor: string = '';
  rangoIcon: string = '';
  rangoNext: string = '';
  puntosParaSiguiente: number = 0;

  // SVG circulares
  circuloArboles: number = 0;
  circuloCO2: number = 0;
  circuloRango: number = 0;
  circuloPlastico: number = 0;

  // Usuario en ranking
  miPosicion: number = -1;

  readonly CIRCUMFERENCE = 2 * Math.PI * 54; // r=54

  constructor(
    private uS: UsuarioService,
    private aS: ActividadService,
    private lS: LoginService
  ) {}

  ngOnInit(): void {
    const id = this.lS.getID();
    if (id) {
      this.uS.listId(parseInt(id)).subscribe(user => {
        this.usuario = user;
        this.puntos = user.puntosAcumulados ?? 0;
        this.calcularMetricas();
        this.cargarRanking(user.distrito);
        this.cargando = false;
      });
    }
  }

  calcularMetricas(): void {
    // Conversiones ecológicas (por cada 10 pts = 1 botella PET ≈ 0.025kg plástico)
    // 20 pts = 1 botella, 1 árbol = 400 botellas recicladas = 8000 pts
    this.arbolesSalvados = Math.floor(this.puntos / 800); // 1 árbol cada 800 pts
    this.co2Evitado = Math.round(this.puntos * 0.025 * 10) / 10; // 0.025 kg CO2 por punto
    this.plasticoReciclado = Math.round(this.puntos * 0.012 * 10) / 10; // 0.012 kg plástico por punto

    // Rangos
    if (this.puntos < 100) {
      this.rango = 'Aprendiz Verde'; this.rangoColor = '#7f8c8d';
      this.rangoIcon = 'eco'; this.rangoNext = 'Bronce'; this.puntosParaSiguiente = 100 - this.puntos;
    } else if (this.puntos < 300) {
      this.rango = 'Bronce 🥉'; this.rangoColor = '#cd7f32';
      this.rangoIcon = 'workspace_premium'; this.rangoNext = 'Plata'; this.puntosParaSiguiente = 300 - this.puntos;
    } else if (this.puntos < 700) {
      this.rango = 'Plata 🥈'; this.rangoColor = '#95a5a6';
      this.rangoIcon = 'workspace_premium'; this.rangoNext = 'Oro'; this.puntosParaSiguiente = 700 - this.puntos;
    } else if (this.puntos < 1500) {
      this.rango = 'Oro 🥇'; this.rangoColor = '#f39c12';
      this.rangoIcon = 'star'; this.rangoNext = 'Platino'; this.puntosParaSiguiente = 1500 - this.puntos;
    } else {
      this.rango = 'Platino 💎'; this.rangoColor = '#1abc9c';
      this.rangoIcon = 'diamond'; this.rangoNext = ''; this.puntosParaSiguiente = 0;
    }

    // SVG progress (0-100 escala)
    this.circuloArboles = Math.min((this.arbolesSalvados / 20) * 100, 100);
    this.circuloCO2 = Math.min((this.co2Evitado / 50) * 100, 100);
    this.circuloPlastico = Math.min((this.plasticoReciclado / 30) * 100, 100);
    const rangoMax = [100, 300, 700, 1500, 3000];
    const rangoActual = this.puntos < 100 ? 100 : this.puntos < 300 ? 300 :
                        this.puntos < 700 ? 700 : this.puntos < 1500 ? 1500 : 3000;
    const rangoAnterior = rangoActual === 100 ? 0 : rangoActual === 300 ? 100 :
                          rangoActual === 700 ? 300 : rangoActual === 1500 ? 700 : 1500;
    this.circuloRango = Math.min(((this.puntos - rangoAnterior) / (rangoActual - rangoAnterior)) * 100, 100);
  }

  cargarRanking(distrito: string): void {
    this.aS.getRankingDistrito(distrito).subscribe(data => {
      this.ranking = data;
      const mi = data.findIndex((r: RankingDistritoDTO) => r.username === this.usuario.username);
      this.miPosicion = mi >= 0 ? mi + 1 : -1;
    });
  }

  /** Calcula el dashoffset del SVG circle según % */
  getDashOffset(percent: number): number {
    return this.CIRCUMFERENCE - (percent / 100) * this.CIRCUMFERENCE;
  }

  getMedalIcon(posicion: number): string {
    if (posicion === 1) return '🥇';
    if (posicion === 2) return '🥈';
    if (posicion === 3) return '🥉';
    return `#${posicion}`;
  }
}
