import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Actividad } from '../../../models/Actividad';
import { ActividadService } from '../../../services/actividad.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-listaractividad',
  standalone: true,
  imports: [MatIconModule, RouterLink, CommonModule,MatPaginatorModule,MatCardModule],
  templateUrl: './listaractividad.component.html',
  styleUrls: ['./listaractividad.component.css']  // Corrige 'styleUrl' a 'styleUrls'
})
export class ListaractividadComponent implements OnInit, AfterViewInit {
  // Lista normal de actividades
  actividades: Actividad[] = [];
  pagedData: Actividad[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  role:String='';

  constructor(private aS: ActividadService, private lS: LoginService) { }

  ngOnInit(): void {
     this.role = this.lS.showRole();
    // Obtener las actividades
    this.aS.list().subscribe((data) => {
      // Ordenar actividades de la más reciente a la más antigua
      this.actividades = data.sort((a,b) => new Date(b.fecha_recepcion).getTime() - new Date(a.fecha_recepcion).getTime());
      this.updatePagedData();
    });
  }

  ngAfterViewInit(): void {
    // Actualizar los datos cuando se cambia de página
    this.paginator.page.subscribe(() => {
      this.updatePagedData();
    });
  }

  // Función para actualizar los datos según la página actual
  updatePagedData(): void {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    this.pagedData = this.actividades.slice(startIndex, endIndex);
  }

  eliminar(id: number): void {
    this.aS.delete(id).subscribe(() => {
      // Después de eliminar, obtener la lista actualizada y ordenar
      this.aS.list().subscribe((data) => {
        this.actividades = data.sort((a,b) => new Date(b.fecha_recepcion).getTime() - new Date(a.fecha_recepcion).getTime());
        this.updatePagedData();  // Actualizar los datos mostrados
      });
    });
  }
   isAdmi(){
    return this.role === 'ADMI';
  }

  getIconForActivity(tipo: string): string {
    if (!tipo) return 'recycling';
    const t = tipo.toLowerCase();
    if (t.includes('plástico') || t.includes('pet')) return 'local_drink';
    if (t.includes('cartón') || t.includes('papel')) return 'description';
    if (t.includes('vidrio')) return 'wine_bar';
    if (t.includes('lata') || t.includes('aluminio') || t.includes('chatarra')) return 'takeout_dining';
    if (t.includes('pilas') || t.includes('baterías')) return 'battery_charging_full';
    if (t.includes('electrónico')) return 'computer';
    if (t.includes('aceite')) return 'water_drop';
    if (t.includes('madera')) return 'park';
    if (t.includes('ropa')) return 'checkroom';
    if (t.includes('tapita')) return 'radio_button_checked';
    return 'recycling';
  }
}
