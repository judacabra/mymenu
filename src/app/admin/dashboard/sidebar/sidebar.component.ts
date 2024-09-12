import { Component, OnInit } from '@angular/core';

export interface View {
    id: number,
    id_type: number,
    url: string,
    name: string,
    icon: string,
}

@Component({
    selector: 'app-dashboard-sidebar',
    standalone: true,
    imports: [],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})

export class SidebarDashboardComponent {
    public path_img: string = '../../../public/img/';
    
    public views: View[] = [
        {
            id: 1,
            id_type: 2,
            url: 'dashboard',
            name: 'Dasboard',
            icon: 'fas fa-chart-line',
        },
        {
            id: 2,
            id_type: 1,
            url: 'users',
            name: 'Usuarios',
            icon: 'fas fa-users',
        },
        {
            id: 3,
            id_type: 1,
            url: 'company',
            name: 'Empresa',
            icon: 'fas fa-building',
        },
        {
            id: 4,
            id_type: 1,
            url: 'profiles',
            name: 'Perfiles',
            icon: 'fas fa-check-square',
        },
        {
            id: 5,
            id_type: 2,
            url: 'products',
            name: 'Productos',
            icon: 'fas fa-hamburger',
        },
    ]

    setURL(url:string) {
        window.location.href = url;
    }
}
