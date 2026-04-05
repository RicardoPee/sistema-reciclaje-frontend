import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CentroReciclaje } from '../../../models/CentroReciclaje';
import { CentroReciclajeService } from '../../../services/centro-reciclaje.service';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { FavoritosService } from '../../../services/favoritos.service';
import { Favoritos } from '../../../models/Favoritos';
import { LoginService } from '../../../services/login.service';
import { Usuario } from '../../../models/Usuario';
import * as L from 'leaflet';

export interface CentroVisual extends CentroReciclaje {
  isFavorite?: boolean;
  idFavorito?: number;
}

// Fix para los íconos de Leaflet en Angular
const iconDefault = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

@Component({
  selector: 'app-listarcentroreciclaje',
  standalone: true,
  imports: [MatTableModule, MatIconModule, RouterLink, MatCardModule, MatPaginatorModule, CommonModule, FormsModule],
  templateUrl: './listarcentroreciclaje.component.html',
  styleUrls: ['./listarcentroreciclaje.component.css']
})
export class ListarcentroreciclajeComponent implements OnInit, AfterViewInit {

  centrosOriginales: CentroReciclaje[] = [];
  centros: CentroVisual[] = [];
  pagedData: CentroVisual[] = [];
  misFavoritos: Favoritos[] = [];
  searchText: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private map: any;
  private markersLayer = L.layerGroup();
  role: String = '';

  private readonly mapboxToken = 'AQUI_VA_EL_TOKEN';

  constructor(
    private cS: CentroReciclajeService,
    private router: Router,
    private lS: LoginService,
    private fS: FavoritosService
  ) { }

  ngOnInit(): void {
    this.role = this.lS.showRole();
    if(this.isCliente() || this.isAdmi()) {
      this.fetchFavoritos();
    } else {
       this.fetchCentros();
    }
  }

  fetchFavoritos() {
    const myId = this.lS.getID();
    this.fS.list().subscribe(favs => {
      this.misFavoritos = favs.filter(f => String(f.user.idUser) === String(myId));
      this.fetchCentros();
    });
  }

  fetchCentros() {
    this.cS.list().subscribe(data => {
      this.centrosOriginales = data;
      this.procesarDatos();
    });
    this.cS.getList().subscribe((data) => {
      this.centrosOriginales = data;
      this.procesarDatos();
    });
  }

  procesarDatos() {
    let filtrados = this.centrosOriginales;

    if (this.searchText.trim() !== '') {
      const term = this.searchText.toLowerCase();
      filtrados = filtrados.filter(c => c.direccion.toLowerCase().includes(term));
    }

    const mapCentros: CentroVisual[] = filtrados.map(c => {
       const favEntry = this.misFavoritos.find(f => f.centroReciclaje.idCentroReciclaje === c.idCentroReciclaje);
       return {
          ...c,
          isFavorite: !!favEntry,
          idFavorito: favEntry ? favEntry.idFavorito : undefined
       };
    });

    mapCentros.sort((a,b) => {
       if (a.isFavorite && !b.isFavorite) return -1;
       if (!a.isFavorite && b.isFavorite) return 1;
       return 0;
    });

    this.centros = mapCentros;
    if(this.paginator) { this.paginator.pageIndex = 0; }
    this.updatePagedData();
  }

  filtrarCentros() {
    this.procesarDatos();
  }

  toggleFavorito(centroInput: CentroVisual) {
    // Buscamos el canonical en centros[] para mutar in-place
    const centro = this.centros.find(c => c.idCentroReciclaje === centroInput.idCentroReciclaje) ?? centroInput;

    // Usar misFavoritos como fuente de verdad para el idFavorito
    const favReal = this.misFavoritos.find(f => f.centroReciclaje.idCentroReciclaje === centro.idCentroReciclaje);

    if (favReal) {
        // YA ES FAVORITO → ELIMINAR
        const idToDelete = favReal.idFavorito;
        // Actualización optimista visual
        centro.isFavorite = false;
        centro.idFavorito = undefined;
        this.misFavoritos = this.misFavoritos.filter(f => f.idFavorito !== idToDelete);
        this.sortAndSaveLocally();

        this.fS.delete(idToDelete).subscribe({
          error: () => {
            // Revertir si el delete falla en la BD
            centro.isFavorite = true;
            centro.idFavorito = idToDelete;
            this.misFavoritos.push(favReal);
            this.sortAndSaveLocally();
          }
        });
    } else {
        // NO ES FAVORITO → GUARDAR
        centro.isFavorite = true;
        this.sortAndSaveLocally();

        const nuevoFav = new Favoritos();
        const numUserId = parseInt(this.lS.getID() || '0');
        nuevoFav.user.idUser = numUserId;
        nuevoFav.centroReciclaje.idCentroReciclaje = centro.idCentroReciclaje;

        this.fS.insert(nuevoFav).subscribe({
          next: () => {
            // Recargar misFavoritos para tener el idFavorito real del servidor
            const myId = this.lS.getID();
            this.fS.list().subscribe(favs => {
              this.misFavoritos = favs.filter(f => String(f.user.idUser) === String(myId));
              const saved = this.misFavoritos.find(f => f.centroReciclaje.idCentroReciclaje === centro.idCentroReciclaje);
              if (saved) {
                centro.idFavorito = saved.idFavorito;
              }
            });
          },
          error: () => {
            centro.isFavorite = false;
            this.sortAndSaveLocally();
          }
        });
    }
  }

  sortAndSaveLocally() {
    this.centros.sort((a,b) => {
       if (a.isFavorite && !b.isFavorite) return -1;
       if (!a.isFavorite && b.isFavorite) return 1;
       return 0;
    });
    this.updatePagedData();
  }

  ngAfterViewInit(): void {
    // Iniciar mapa después de que el DOM esté listo
    setTimeout(() => {
      this.initMap();
      this.dibujarTodosLosPuntos(); // Dibujar cuando ya hay datos
    }, 100);

    this.paginator.page.subscribe(() => {
      this.updatePagedData();
    });
  }

  initMap(): void {
    this.map = L.map('map').setView([-12.046374, -77.042793], 12); // Centro default en Lima

    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=' + this.mapboxToken, {
      attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(this.map);

    this.markersLayer.addTo(this.map);
  }

  dibujarTodosLosPuntos(): void {
    if (!this.map || this.centros.length === 0) return;
    
    this.markersLayer.clearLayers();
    this.centros.forEach(centro => {
      if (centro.latitud && centro.longitud) {
        L.marker([centro.latitud, centro.longitud], { icon: iconDefault })
          .bindPopup(`<b>${centro.direccion}</b><br>Centro de Reciclaje`)
          .addTo(this.markersLayer);
      }
    });

    if (this.centros.length > 0 && this.centros[0].latitud) {
      this.map.setView([this.centros[0].latitud, this.centros[0].longitud], 13);
    }
  }

  showOnMap(lat: number, lng: number): void {
    const position: L.LatLngExpression = [lat, lng];
    this.map.flyTo(position, 17, { animate: true, duration: 1.5 });
  }

  updatePagedData(): void {
    if (!this.paginator) return;
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    this.pagedData = this.centros.slice(startIndex, endIndex);
    this.dibujarTodosLosPuntos(); // Refrescar los puntos en vivo al actualizar o avanzar data
  }

  getFormattedLocation(element: CentroReciclaje): string {
    return `(${element.latitud}, ${element.longitud})`;
  }

  eliminar(id: number) {
    this.cS.delete(id).subscribe(() => {
      this.cS.list().subscribe((data) => {
        this.cS.setList(data);
        this.centros = data;
        this.updatePagedData();
      });
    });
  }

  isAdmi() {
    return this.role === 'ADMI';
  }

  isCliente() {
    return this.role === 'CLIENTE';
  }

  get dynamicPageSizeOptions(): number[] {
    const total = this.centros.length;
    // Agregamos el total a las opciones base si es mayor a cero y no está en la lista.
    const baseOptions = [10, 20, 60];
    if (total > 0 && !baseOptions.includes(total)) {
      return [...baseOptions, total].sort((a, b) => a - b);
    }
    return baseOptions;
  }
}
