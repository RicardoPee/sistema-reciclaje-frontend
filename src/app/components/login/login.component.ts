import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtRequest } from '../../models/jwtRequest';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule,FormsModule,MatInputModule,MatButtonModule, MatIcon],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent  {
  constructor(
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  username: string = '';
  password: string = '';
  mensaje: string = '';
  hidePassword: boolean = true; 


  login() {
    let request = new JwtRequest();
    request.username = this.username;
    request.password = this.password;
    this.loginService.login(request).subscribe(
      (data: any) => {
        sessionStorage.setItem('token', data.jwttoken);
        const role = this.loginService.showRole();
        if (role === 'ADMI') {
          this.router.navigate(['usuarios']);
        } else if (role === 'EMPLEADO') {
          this.router.navigate(['empleado/pendientes']);
        } else {
          this.router.navigate(['dashboard']);
        }
      },
      (error) => {
        this.mensaje = 'Credenciales incorrectas!!!';
        this.snackBar.open(this.mensaje, 'Aviso', { duration: 2000 });
      }
    );
  }
  
  navigateToRegister() {
    this.router.navigate(['/home']);
  }

  NavigateToReturn() {
    this.router.navigate(['/'])
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword; 
  }
}
