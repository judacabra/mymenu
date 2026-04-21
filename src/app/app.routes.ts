import { Routes } from '@angular/router';
import { authGuard } from '@core/authGuard/auth.guard';

const isToken: boolean = localStorage.getItem('token') !== "";

export const routes: Routes = [
  {
    path: 'index',
    title: 'MyMenu',
    loadComponent: () => import('./webpage/webpage.component'),
  },
  {
    path: 'admin',
    title: 'Login',
    loadComponent: () => import('./admin/login/login.component'),
  },
  {
    path: 'dashboard',
    title: 'Dashboard',
    loadComponent: () => import('./admin/dashboard/dashboard.component'),
    canActivate: [authGuard],
  },
  {
    path: 'products',
    title: 'Productos',
    loadComponent: () => import('./admin/dashboard/views/products/products.component'),
    canActivate: [authGuard],
  },
  {
    path: 'companies',
    title: 'Empresas',
    loadComponent: () => import('./admin/dashboard/views/companies/companies.component'),
    canActivate: [authGuard],
  },
  {
    path: 'users',
    title: 'Usuarios',
    loadComponent: () => import('./admin/dashboard/views/users/users.component'),
    canActivate: [authGuard],
  },
  {
    path: 'profiles',
    title: 'Perfiles',
    loadComponent: () => import('./admin/dashboard/views/profiles/profiles.component'),
    canActivate: [authGuard],
  },
  {
    path: ':restaurant/home',
    title: 'Inicio',
    loadComponent: () => import('./restaurant/inicio/inicio.component'),
  },
  {
    path: ':restaurant/menu',
    title: 'Menu',
    loadComponent: () => import('./restaurant/menu/menu.component'),
  },
  {
    path: ':restaurant/menu/list',
    title: 'Menu',
    loadComponent: () => import('./restaurant/menu/list/list.component'),
  },
  {
    path: ':restaurant/bookings',
    title: 'Reservas',
    loadComponent: () => import('./restaurant/bookings/bookings.component'),
  },
  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: isToken ? 'dashboard' : 'index',
    pathMatch: 'full',
  },
];
