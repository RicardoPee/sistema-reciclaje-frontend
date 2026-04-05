import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../models/Usuario';
import { UsuarioService } from '../../../services/usuario.service';
import { Rol } from '../../../models/Rol';
import { RolService } from '../../../services/rol.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-creareditarusuario',
  standalone: true,
  imports: [
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule, 
    MatCheckboxModule,
    MatFormFieldModule,
  MatIconModule],
  templateUrl: './creareditarusuario.component.html',
  styleUrl: './creareditarusuario.component.css',
})
export class creareditarusuarioComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  listaRoles: Rol[]=[];
  usuario: Usuario = new Usuario();
  role:String='';


  hidePassword: boolean = true; 


  id: number = 0;
  edicion: boolean = false;

  listaGenero: { value: string; viewValue: string }[] = [
    { value: 'Masculino', viewValue: 'Masculino' },
    { value: 'Femenino', viewValue: 'Femenino' },
  ];

  constructor(
    private uS: UsuarioService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route:ActivatedRoute,
    private rS: RolService,
    private lS:LoginService
  ) {}
  ngOnInit(): void {
    this.role = this.lS.showRole(); 
    this.route.params.subscribe((data: Params) => {
      this.id = data['id']
      this.edicion = data['id'] != null
      this.init()
    });
    this.form = this.formBuilder.group({
      hcodigo: [''],
      hnombres: ['', Validators.required],
      hapellidos: ['', Validators.required],
      husername: ['', Validators.required],
      hdni: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(8),
          Validators.pattern(/^\d+$/), // Validación adicional: solo números
        ],
      ],
      hedad: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(2),
        Validators.pattern(/^\d+$/), // Validación adicional: solo números
      ],],
      hgenero: ['', Validators.required],
      hdistrito: ['', Validators.required],
      htelefono: ['', [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9),
        Validators.pattern(/^\d+$/), // Validación adicional: solo números
      ],],
      hcorreo: ['', Validators.required],
      hpassword: ['', Validators.required],
      henabled: [false, Validators.required],
      hroles: ['', Validators.required]
    });

    this.rS.list().subscribe((data) => {
      this.listaRoles = data;
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword; // Cambia el estado de `hidePassword`.
  }

  insertar(): void {
    
    if (this.form.invalid) {
      this.form.markAllAsTouched(); 
      return; 
    }
    
    if (this.form.valid) {
      this.usuario.idUser = this.form.value.hcodigo;
      this.usuario.nombres = this.form.value.hnombres;
      this.usuario.apellidos = this.form.value.hapellidos;
      this.usuario.username = this.form.value.husername;
      this.usuario.dni = this.form.value.hdni;
      this.usuario.edad = this.form.value.hedad;
      this.usuario.genero = this.form.value.hgenero;
      this.usuario.distrito = this.form.value.hdistrito;
      this.usuario.telefono = this.form.value.htelefono;
      this.usuario.correo = this.form.value.hcorreo;
      this.usuario.password = this.form.value.hpassword;
      this.usuario.enabled = this.form.value.henabled;
      this.usuario.rol.idRol = this.form.value.hroles;

      if (this.edicion) {
        this.uS.update(this.usuario).subscribe((data) => {
          this.uS.list().subscribe((data) => {
            this.uS.setList(data);
            this.refreshComponent();
          });
        });
      } else {
        this.uS.insert(this.usuario).subscribe((data) => {
          this.uS.list().subscribe((data) => {
            this.uS.setList(data);
            this.refreshComponent();
          });
        });
      }
    }
    this.router.navigate(['usuarios']);
  }
  private refreshComponent(): void {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['usuarios'])
    });
  }
  init() {
    if (this.edicion) {
      this.uS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          hcodigo: new FormControl(data.idUser),
          hnombres: new FormControl(data.nombres),
          hapellidos: new FormControl(data.apellidos),
          husername: new FormControl(data.username),
          hdni: new FormControl(data.dni),
          hedad: new FormControl(data.edad),
          hgenero: new FormControl(data.genero),
          hdistrito: new FormControl(data.distrito),
          htelefono: new FormControl(data.telefono),
          hcorreo: new FormControl(data.correo),
          hpassword: new FormControl(''),
          henabled: new FormControl(data.enabled),
          hroles: new FormControl(data.rol.idRol)
        });
      });
    }
  }

  isAdmi(): boolean {
    return this.role === 'ADMI';
  }
}
