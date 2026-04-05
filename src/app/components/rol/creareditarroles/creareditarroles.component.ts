import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Rol } from '../../../models/Rol';
import { RolService } from '../../../services/rol.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-creareditarroles',
  standalone: true,
  imports: [MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './creareditarroles.component.html',
  styleUrl: './creareditarroles.component.css'
})
export class CreareditarrolesComponent implements OnInit{
  form: FormGroup = new FormGroup({});
  roles: Rol = new Rol();

  id: number = 0;
  edicion: boolean = false;

  constructor(
    private rS: RolService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      //trae los datos
      this.init();
    });

    this.form = this.formBuilder.group({
      hcodigo: [''],
      hnombre: ['', Validators.required]
    });

  }

  insertar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // Marca todos los controles como tocados para disparar las validaciones
      return; // Detiene la ejecución si el formulario no es válido
    }
    
    if (this.form.valid) {
      this.roles.idRol = this.form.value.hcodigo;
      this.roles.nombreRol = this.form.value.hnombre;
      if (this.edicion) {
        this.rS.update(this.roles).subscribe((data) => {
          this.rS.list().subscribe((data) => {
            this.rS.setList(data);
          });
        });
      } else {
        this.rS.insert(this.roles).subscribe((data) => {
          this.rS.list().subscribe((data) => {
            this.rS.setList(data);
          });
        });
      }
    }
    this.router.navigate(['roles']);
  }

  init() {
    if (this.edicion) {
      this.rS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          hcodigo: new FormControl(data.idRol),
          hnombre: new FormControl(data.nombreRol),
        });
      });
    }
  }
}
