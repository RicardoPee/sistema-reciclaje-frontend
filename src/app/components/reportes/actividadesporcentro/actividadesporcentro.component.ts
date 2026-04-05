import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActividadesPorCentroDTO } from '../../../models/ActividadesPorCentroDTO';
import { ActividadService } from '../../../services/actividad.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions, ChartType, Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-actividadesporcentro',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, BaseChartDirective],
  templateUrl: './actividadesporcentro.component.html',
  styleUrls: ['./actividadesporcentro.component.css']
})
export class ActividadesporcentroComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  dataSource: MatTableDataSource<ActividadesPorCentroDTO> = new MatTableDataSource();

  // Paleta Eco-Reciclaje
  private softColors = [
    '#22c55e', '#16a34a', '#15803d', '#166534', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#0ea5e9'
  ];

  
  barChartData: ChartData<'bar'> = {
    labels: [], 
    datasets: [
      {
        data: [], 
        label: 'Cantidad de Actividades',
        backgroundColor: [], 
        borderColor: [],     
        borderWidth: 1
      }
    ]
  };

  barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 10, bottom: 20 }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y} actividades`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
          font: { family: 'Inter, sans-serif', size: 12 }
        },
        grid: {
          color: '#f1f5f9'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 30,
          font: { family: 'Inter, sans-serif', size: 11 },
          color: '#475569'
        }
      }
    }
  };

  constructor(private apcS: ActividadService) {}

  ngOnInit(): void {
    this.fetchActividadporCentro();
  }

  fetchActividadporCentro(): void {
    this.apcS.getActividadesporCentro().subscribe(
      (data: ActividadesPorCentroDTO[]) => {
        this.dataSource.data = data;
        
        // Configura los datos para el gráfico
        this.barChartData.labels = data.map(item => `${item.nombre_centro}`);
        this.barChartData.datasets[0].data = data.map(item => item.numero_actividades);

        // Asigna los colores suaves a las barras, según la cantidad de centros
        this.barChartData.datasets[0].backgroundColor = this.getSoftColors(data.length);
        this.barChartData.datasets[0].borderColor = this.getSoftColors(data.length);

        // Actualiza el gráfico
        this.chart?.update();
      },
      (error) => {
        console.error('Error fetching actividad centro data', error);
      }
    );
  }

  // Función para asignar los colores suaves según la cantidad de barras
  private getSoftColors(numberOfBars: number): string[] {
    const selectedColors = [];
    for (let i = 0; i < numberOfBars; i++) {
      selectedColors.push(this.softColors[i % this.softColors.length]);
    }
    return selectedColors;
  }
}