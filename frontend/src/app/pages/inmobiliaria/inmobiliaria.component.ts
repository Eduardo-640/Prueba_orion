import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgIf, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { Observable, of } from 'rxjs';

// Importa el componente de formulario para el diálogo
import { InmobiliariaFormComponent } from '../../components/inmobiliaria-form/inmobiliaria-form.component';

// Angular Material
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';

// Interfaz para las estadísticas de ventas
export interface PeriodicElement {
  inmuebles: string;
  mes: number;
  venta: number;
}

@Component({
  selector: 'app-inmobiliaria',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatTableModule,
    MatTabsModule,
    MatDialogModule,
  ],
  templateUrl: './inmobiliaria.component.html',
  styleUrls: ['./inmobiliaria.component.css']
})
export class InmobiliariaComponent implements AfterViewInit {
  // Propiedades para almacenar datos de la inmobiliaria
  name: string = '';
  address: string = '';
  latitude: number = 0;
  longitude: number = 0;
  errorMessage: string = ''; // Mensaje de error para mostrar al usuario

  // Configuración de la tabla de estadísticas de ventas
  displayedColumns: string[] = ['mes', 'inmuebles', 'venta'];
  dataSource: any[] = []; // Fuente de datos para la tabla

  private map: L.Map | undefined; // Mapa de Leaflet

  constructor(private http: HttpClient, private router: Router, public dialog: MatDialog) {}

  // Método que se ejecuta después de que la vista se haya inicializado
  ngAfterViewInit(): void {
    // Obtener todas las inmobiliarias y mostrarlas en el mapa
    this.todas_inmobiliarias().subscribe(
      (inmobiliarias) => {
        console.log('Inmobiliarias obtenidas:', inmobiliarias); // Log para depuración
        this.initMap(inmobiliarias); // Inicializar el mapa con las inmobiliarias
      },
      (error) => {
        console.error('Error al obtener las inmobiliarias:', error); // Log de error
      }
    );
    
    // Obtener todas las ventas y mostrarlas en la tabla
    this.todas_ventas().subscribe(
      (ventas) => {
        console.log('Ventas obtenidas:', ventas); // Log para depuración
        this.dataSource = ventas; // Asignar los datos de ventas a la tabla
      },
      (error) => {
        console.error('Error al obtener las ventas:', error); // Log de error
      }
    );
  }

  // Inicializa el mapa y añade marcadores para las inmobiliarias
  private initMap(inmobiliarias: any[]): void {
    this.map = L.map('map').setView([4.60971, -74.08175], 13); // Coordenadas iniciales (Bogotá)
    
    // Añadir capa base al mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    
    // Añadir marcadores dinámicamente para cada inmobiliaria
    inmobiliarias.forEach((inmobiliaria) => {
      if (inmobiliaria.latitude && inmobiliaria.longitude) {
        L.marker([inmobiliaria.latitude, inmobiliaria.longitude])
        .addTo(this.map!)
        .bindPopup(`<b>${inmobiliaria.name}</b><br>${inmobiliaria.address}`)
        .openPopup();
      }
    });
  }

  // Abre el formulario de diálogo para añadir una nueva inmobiliaria
  openFormDialog(): void {
    const dialogRef = this.dialog.open(InmobiliariaFormComponent, {
      width: '400px',
      data: {
        name: '',
        address: '',
        latitude: 0,
        longitude: 0
      }
    });

    // Manejar el resultado del formulario
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.nueva_inmobiliaria(result); // Añadir la nueva inmobiliaria
      }
    });
  }

  // Añade una nueva inmobiliaria al backend y al mapa
  nueva_inmobiliaria(data: any): void {
    const token = localStorage.getItem('token');

    if (!token) {
      this.errorMessage = 'No se encontró un token. Por favor, inicie sesión.';
      console.error('Error: No se encontró un token.'); // Log de error
      return;
    }

    const headers = {
      'x-access-token': token,
      'Content-Type': 'application/json'
    };

    this.http.post('http://localhost:4000/api/inmobiliaria', data, { headers })
      .subscribe(
        (response: any) => {
          console.log('Añadido Exitosamente', response); // Log para depuración

          // Añadir la nueva inmobiliaria al mapa
          if (this.map && data.latitude && data.longitude) {
            L.marker([data.latitude, data.longitude])
              .addTo(this.map)
              .bindPopup(`<b>${data.name}</b><br>${data.address}`)
              .openPopup();
          }

          // Opcional: Actualizar la lista de inmobiliarias en el frontend
          this.todas_inmobiliarias().subscribe(
            (inmobiliarias) => {
              console.log('Lista de inmobiliarias actualizada:', inmobiliarias); // Log para depuración
            },
            (error) => {
              console.error('Error al actualizar la lista de inmobiliarias:', error); // Log de error
            }
          );
        },
        (error) => {
          this.errorMessage = 'Errores en la creación de la inmobiliaria';
          console.error('Error:', error); // Log de error
        }
      );
  }

  // Obtiene todas las inmobiliarias desde el backend
  todas_inmobiliarias(): Observable<any[]> {
    const token = localStorage.getItem('token');

    if (!token) {
      this.errorMessage = 'No se encontró un token. Por favor, inicie sesión.';
      console.error('Error: No se encontró un token.'); // Log de error
      return of([]); // Devuelve un Observable vacío si no hay token
    }

    const headers = {
      'x-access-token': token,
      'Content-Type': 'application/json'
    };

    return this.http.get<any[]>('http://localhost:4000/api/inmobiliaria', { headers });
  }

  // Obtiene todas las ventas desde el backend
  todas_ventas(): Observable<any[]> {
    const token = localStorage.getItem('token');

    if (!token) {
      this.errorMessage = 'No se encontró un token. Por favor, inicie sesión.';
      console.error('Error: No se encontró un token.'); // Log de error
      return of([]); // Devuelve un Observable vacío si no hay token
    }

    const headers = {
      'x-access-token': token,
      'Content-Type': 'application/json'
    };

    return this.http.get<any[]>('http://localhost:4000/api/venta', { headers });
  }
}