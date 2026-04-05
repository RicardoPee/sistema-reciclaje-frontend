import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CentroReciclajeService } from '../../../services/centro-reciclaje.service';
import { CentroReciclaje } from './../../../models/CentroReciclaje';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoginService } from '../../../services/login.service';
import { MatIconModule } from '@angular/material/icon';
import * as L from 'leaflet';

// Fix para los íconos de Leaflet en Angular
const iconDefault = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

@Component({
  selector: 'app-creareditarcentroreciclaje',
  standalone: true,
  imports: [
    MatInputModule, MatSelectModule,
    MatDatepickerModule, MatNativeDateModule,
    MatButtonModule, ReactiveFormsModule,
    CommonModule, MatFormFieldModule,
    MatIconModule
  ],
  templateUrl: './creareditarcentroreciclaje.component.html',
  styleUrl: './creareditarcentroreciclaje.component.css'
})
export class CreareditarcentroreciclajeComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  centroReciclaje: CentroReciclaje = new CentroReciclaje();
  id: number = 0;
  edicion: boolean = false;
  role: string = '';
  
  private map: any;
  private marker: any;
  private readonly mapboxToken = 'AQUI_VA_EL_TOKEN_MAPBOX';

  constructor(
    private cS: CentroReciclajeService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private lS: LoginService,
  ) { }

  ngOnInit(): void {
    this.role = this.lS.showRole();

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.form = this.formBuilder.group({
      hcodigo: [''],
      hdireccion: ['', Validators.required],
      hlatitud: ['', Validators.required],
      hlongitud: ['', Validators.required],
    });

    setTimeout(() => this.initMap(), 200); // Dar tiempo al renderizado de la UI
  }

  initMap(): void {
    const defaultParams: L.LatLngExpression = this.edicion && this.centroReciclaje.latitud 
      ? [this.centroReciclaje.latitud, this.centroReciclaje.longitud] 
      : [-12.046374, -77.042793]; // Centro en Lima

    this.map = L.map('formMap').setView(defaultParams, 12);

    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=' + this.mapboxToken, {
      attribution: '© Mapbox',
      maxZoom: 19
    }).addTo(this.map);

    // Evento Click para autocompletar form y obtener dirección
    this.map.on('click', (e: any) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng, { icon: iconDefault }).addTo(this.map);
      }

      // 1. Asignar latitud y longitud automáticamente
      this.form.patchValue({
        hlatitud: lat,
        hlongitud: lng
      });

      // 2. Extraer Dirección usando Reverse Geocoding de Mapbox
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${this.mapboxToken}&language=es`;
      fetch(url)
        .then(res => res.json())
        .then(data => {
          let direccion = "Punto en el mapa (Sin dirección específica)";
          if (data.features && data.features.length > 0) {
            // Se toma el nombre del lugar más preciso devuelto por Mapbox
            direccion = data.features[0].place_name;
          }
          
          // Truncar si la dirección es estúpidamente larga (limite de JPA es 225)
          if (direccion.length > 220) {
            direccion = direccion.substring(0, 220) + "...";
          }
          
          this.form.patchValue({
            hdireccion: direccion
          });
        })
        .catch(err => {
          console.error("Error obteniendo dirección:", err);
          this.form.patchValue({ hdireccion: "Error al conseguir dirección" });
        });
    });
  }

  insertar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.centroReciclaje.idCentroReciclaje = this.form.value.hcodigo;
    this.centroReciclaje.direccion = this.form.value.hdireccion;
    this.centroReciclaje.latitud = this.form.value.hlatitud;
    this.centroReciclaje.longitud = this.form.value.hlongitud;

    if (this.edicion) {
      this.cS.update(this.centroReciclaje).subscribe(() => {
        this.cS.list().subscribe((data) => {
          this.cS.setList(data);
        });
      });
    } else {
      this.cS.insert(this.centroReciclaje).subscribe(() => {
        this.cS.list().subscribe((data) => {
          this.cS.setList(data);
        });
      });
    }
    this.router.navigate(['centroreciclaje']);
  }

  init() {
    if (this.edicion) {
      this.cS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          hcodigo: new FormControl(data.idCentroReciclaje),
          hdireccion: new FormControl(data.direccion),
          hlatitud: new FormControl(data.latitud),
          hlongitud: new FormControl(data.longitud),
        });
      });
    }
  }

  isAdmi(): boolean {
    return this.role === 'ADMI';
  }
}
