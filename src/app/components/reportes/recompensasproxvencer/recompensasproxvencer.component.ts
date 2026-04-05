import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { CloseToExpireDTO } from '../../../models/CloseToExpireDTO';
import { RecompensaService } from '../../../services/recompensa.service';
import { MatIconModule } from '@angular/material/icon';

// Register spanish locale for nice dates
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-recompensasproxvencer',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, CommonModule, MatIconModule],
  templateUrl: './recompensasproxvencer.component.html',
  styleUrl: './recompensasproxvencer.component.css'
})
export class RecompensasproxvencerComponent implements OnInit, AfterViewInit{

  displayedColumns: string[] = ['nombre', 'fecha'];
  dataSource = new MatTableDataSource<CloseToExpireDTO>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private rS: RecompensaService) {}

  ngOnInit(): void {
    this.fetchRecompensas();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  fetchRecompensas(): void {
    this.rS.proximoVencimiento().subscribe(
      (data: CloseToExpireDTO[]) => {
        this.dataSource.data = data;
      },
      (error) => {
        console.error('Error fetching proxencer data', error);
      }
    );
  }

  getExpirationStatus(date: string | Date): { status: string, label: string, days: number } {
    const today = new Date();
    today.setHours(0,0,0,0);
    const expDate = new Date(date);
    expDate.setHours(0,0,0,0);
    
    // Calcula la diferencia en días
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'expired', label: 'Vencido', days: diffDays };
    if (diffDays <= 7) return { status: 'critical', label: 'Crítico', days: diffDays };
    if (diffDays <= 30) return { status: 'warning', label: 'Precaución', days: diffDays };
    return { status: 'safe', label: 'Seguro', days: diffDays };
  }
}