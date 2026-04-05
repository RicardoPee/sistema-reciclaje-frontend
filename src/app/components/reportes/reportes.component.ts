import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ActividadesporcentroComponent } from './actividadesporcentro/actividadesporcentro.component';
import { CentrosfavoritosComponent } from './centrosfavoritos/centrosfavoritos.component';
import { CentrosusuariosComponent } from './centrosusuarios/centrosusuarios.component';
import { CantidadnotiusuarioComponent } from './cantidadnotiusuario/cantidadnotiusuario.component';
import { RecompensasproxvencerComponent } from './recompensasproxvencer/recompensasproxvencer.component';
import { RecompensasmasreclamadasComponent } from './recompensasmasreclamadas/recompensasmasreclamadas.component';
import { BuscaruserpordistritoComponent } from './buscaruserpordistrito/buscaruserpordistrito.component';


@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [RouterOutlet, ActividadesporcentroComponent, CentrosfavoritosComponent, CentrosusuariosComponent, CantidadnotiusuarioComponent, RecompensasproxvencerComponent, RecompensasmasreclamadasComponent, BuscaruserpordistritoComponent ],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent implements OnInit{
  constructor(public route: ActivatedRoute){}
  ngOnInit(): void {
      
  }
  
}
