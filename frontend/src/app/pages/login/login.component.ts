import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgIf, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Para la navegación

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    NgIf, CommonModule, FormsModule,
    MatButtonModule, MatFormFieldModule, MatInputModule, MatCardModule, MatIconModule
  ]
})
export class LoginComponent {
  username: string = ''; // Nombre de usuario
  password: string = ''; // Contraseña
  errorMessage: string = ''; // Mensaje de error
  hidePassword: boolean = true; // Controla si la contraseña está oculta

  constructor(private http: HttpClient, private router: Router) {} 

  // Método para iniciar sesión
  login() {
    this.http.post('http://localhost:4000/api/auth/login', { username: this.username, password: this.password })
      .subscribe(
        (response: any) => {
          console.log('Login exitoso', response); // Log de éxito
          localStorage.setItem('token', response.token); // Guarda el token
          this.router.navigate(['/inmobiliaria']); // Redirige al usuario
        },
        (error) => {
          this.errorMessage = 'Credenciales incorrectas'; // Muestra mensaje de error
        }
      );
  }
}
