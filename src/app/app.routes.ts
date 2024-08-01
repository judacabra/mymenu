import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'restaurant/home',
    title: 'Inicio',
    loadComponent: () => import('./restaurant/inicio/inicio.component'),
  },
  {
    path: 'restaurant/menu',
    title: 'Menu',
    loadComponent: () => import('./restaurant/menu/menu.component'),
  },
  {
    path: 'restaurant/menu/list',
    title: 'Menu',
    loadComponent: () => import('./restaurant/menu/list/list.component'),
  },
  {
    path: 'restaurant/bookings',
    title: 'Reservas',
    loadComponent: () => import('./restaurant/bookings/bookings.component'),
  },
  {
    path: 'restaurant/contact',
    title: 'Contacto',
    loadComponent: () => import('./restaurant/contact/contact.component'),
  },
  {
    path: '',
    redirectTo: 'restaurant/home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'restaurant/home',
    pathMatch: 'full',
  },
];
