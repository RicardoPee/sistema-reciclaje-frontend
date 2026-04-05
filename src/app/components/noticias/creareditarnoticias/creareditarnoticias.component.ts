import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Noticias } from '../../../models/Noticias';
import { CentroReciclaje } from '../../../models/CentroReciclaje';
import { NoticiasService } from '../../../services/noticias.service';
import { CentroReciclajeService } from '../../../services/centro-reciclaje.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-creareditarnoticias',
  standalone: true,
  imports: [
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './creareditarnoticias.component.html',
  styleUrl: './creareditarnoticias.component.css',
})
export class CreareditarnoticiasComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  noticias: Noticias = new Noticias();
  centros: CentroReciclaje[] = [];
  role: String = '';

  id: number = 0;
  edicion: boolean = false;

  // Para mostrar cuántas notificaciones serían enviadas
  usuariosAfectados: number = 0;

  constructor(
    private nS: NoticiasService,
    private crS: CentroReciclajeService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private ls: LoginService
  ) {}

  ngOnInit(): void {
    this.role = this.ls.showRole();

    // Cargar centros para el selector
    this.crS.list().subscribe(data => {
      this.centros = data;
    });

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.form = this.formBuilder.group({
      hcodigo: [''],
      htitulo: ['', Validators.required],
      hinformacion: ['', Validators.required],
      hfechaPublicacion: [this.getFechaActual(), Validators.required],
      hcentroReciclaje: [null], // opcional
    });
  }

  getFechaActual(): string {
    const fecha = new Date;
    const year = fecha.getFullYear();
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const day = fecha.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  insertar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.noticias.idNoticias = this.form.value.hcodigo;
    this.noticias.titulo = this.form.value.htitulo;
    this.noticias.informacion = this.form.value.hinformacion;
    this.noticias.fechaPublicacion = this.form.value.hfechaPublicacion;
    this.noticias.centroReciclaje = this.form.value.hcentroReciclaje || undefined;

    if (this.edicion) {
      this.nS.update(this.noticias).subscribe({
        next: () => {
          this.nS.list().subscribe(data => this.nS.setList(data));
          this.router.navigate(['noticias']);
        },
        error: (err) => {
          console.error('Error al actualizar noticia:', err);
          alert('¡Error al actualizar la noticia! Revisa la consola.');
        }
      });
    } else {
      this.nS.insert(this.noticias).subscribe({
        next: () => {
          this.nS.list().subscribe(data => this.nS.setList(data));
          this.router.navigate(['noticias']);
        },
        error: (err) => {
          console.error('Error al registrar noticia:', err);
          alert('¡Error al registrar la noticia! Revisa la consola.');
        }
      });
    }
  }

  init() {
    if (this.edicion) {
      this.nS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          hcodigo: new FormControl(data.idNoticias),
          htitulo: new FormControl(data.titulo),
          hinformacion: new FormControl(data.informacion),
          hfechaPublicacion: new FormControl(data.fechaPublicacion),
          hcentroReciclaje: new FormControl(data.centroReciclaje || null),
        });
      });
    }
  }

  isAdmi() {
    return this.role === 'ADMI';
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.idCentroReciclaje === o2.idCentroReciclaje : o1 === o2;
  }

  trackByCentro(index: number, item: CentroReciclaje): number {
    return item.idCentroReciclaje;
  }
}
