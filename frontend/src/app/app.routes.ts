import { Route } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';

export const routes: Route[] = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirige a login por defecto
  { path: 'inmobiliaria', loadComponent: () => import('./pages/inmobiliaria/inmobiliaria.component').then(m => m.InmobiliariaComponent) }
];
