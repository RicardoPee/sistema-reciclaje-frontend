import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ChartData, ChartOptions, ChartType, Chart, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ObtenerCantidadUsuariosPorDistritoDTO } from '../../../models/ObtenerCantidadUsuariosPorDistritoDTO';
import { UsuarioService } from '../../../services/usuario.service';

Chart.register(...registerables);

@Component({
  selector: 'app-obtenercantidadusuariospordistrito',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, BaseChartDirective],
  templateUrl: './obtenercantidadusuariospordistrito.component.html',
  styleUrl: './obtenercantidadusuariospordistrito.component.css'
})
export class ObtenercantidadusuariospordistritoComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  dataSource: MatTableDataSource<ObtenerCantidadUsuariosPorDistritoDTO> = new MatTableDataSource();

  private softColors = [
    '#A8D0E6', '#FFE156', '#6A0572', '#D4A5A5', '#F4A300', '#2D3142', '#A6E3E9', '#FF9F1C', '#6A0572', '#4B9CD3'
  ];

  doughnutChartData: ChartData<'doughnut'> = {
    labels: [], 
    datasets: [
      {
        data: [], 
        label: 'Usuarios',
        backgroundColor: [], 
        borderColor: [],     
        borderWidth: 2,
        hoverOffset: 10
      }
    ]
  };

  // Opciones del gráfico
  doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right', // Se ve mucho mejor el texto al lado de la dona
      },
      tooltip: {
        enabled: true,
      }
    },
    cutout: '70%' // Hace que la dona luzca más premium y delgada
  };

  constructor(private uS: UsuarioService) {}

  ngOnInit(): void {
    this.fetchCentroUsuarios();
  }

  fetchCentroUsuarios(): void {
    this.uS.getUsuarios().subscribe(
      (data: ObtenerCantidadUsuariosPorDistritoDTO[]) => {
        this.dataSource.data = data;
        
        // Configura los datos para el gráfico
        this.doughnutChartData.labels = data.map(item => item.distrito);  // Distritos
        this.doughnutChartData.datasets[0].data = data.map(item => item.cantidadusuarios);  // Cantidad de usuarios

        // Asigna los colores suaves
        this.doughnutChartData.datasets[0].backgroundColor = this.getSoftColors(data.length);
        this.doughnutChartData.datasets[0].borderColor = '#ffffff';

        // Actualiza el gráfico
        this.chart?.update();
      },
      (error) => {
        console.error('Error fetching centro usuarios data', error);
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


