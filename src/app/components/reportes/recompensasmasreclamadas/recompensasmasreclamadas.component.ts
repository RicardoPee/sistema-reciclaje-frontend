import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';
import { RecompensaService } from '../../../services/recompensa.service';
import { MostClaimedRewardDTO } from '../../../models/MostClaimedRewardDTO';
import { ReclamacionesService } from '../../../services/reclamaciones.service';

Chart.register(...registerables);

@Component({
  selector: 'app-recompensasmasreclamadas',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './recompensasmasreclamadas.component.html',
  styleUrls: ['./recompensasmasreclamadas.component.css']
})
export class RecompensasmasreclamadasComponent implements OnInit {
  barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y', // Gráfico Horizontal
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        ticks: {
          stepSize: 1,
          precision: 0
        },
        grid: {
          color: '#f1f5f9'
        }
      },
      y: {
        grid: {
          display: false
        }
      }
    }
  };
  barChartLabels: string[] = [];
  barChartType: ChartType = 'bar';  
  barChartLegend = true;
  barChartData: ChartDataset[] = [];

  constructor(private rS: ReclamacionesService) {}

  ngOnInit(): void {
    this.rS.cantidadRecompensas().subscribe(
      (data: MostClaimedRewardDTO[]) => {
        this.barChartLabels = data.map(item => item.recompensa);
        this.barChartData = [
          {
            data: data.map(item => item.cantidadreclamos),
            label: 'Canjes Totales',
            backgroundColor: ['#22c55e', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'],
            borderColor: '#ffffff',
            borderWidth: 2,
            borderRadius: 6
          }
        ];
      },
    );
  }
  
}