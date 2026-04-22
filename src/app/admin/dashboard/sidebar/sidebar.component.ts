import { CompanyService } from './../../../services/company/company.service';
import { Component, OnInit } from '@angular/core';

import { UserService } from '@services/user/user.service';

import { Permission } from '@core/interfaces/permission';
import { View } from '@core/interfaces/view';
import { Company } from '@core/interfaces/company';
import { NgClass } from '@angular/common';
import { environment } from 'src/environments';

type Views = "dashboard" | "users" | "companies" | "profiles" | "products";
@Component({
    selector: 'app-dashboard-sidebar',
    standalone: true,
    imports: [NgClass],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})

export class SidebarDashboardComponent implements OnInit {
    public path_img: string = './public/img/';
    public path_server: string = environment.imgUrl;

    public company: Company = {
        id: 0,
        name: '',
        description: '',
        nit: 0,
        img: '',
        active: true,
    }
    
    private permissions: Permission[] = [];

    private views: View[] = [
        {
            id: 1,
            url: 'dashboard',
            name: 'Dashboard',
            icon: 'fas fa-chart-line',
        },
        {
            id: 2,
            url: 'users',
            name: 'Usuarios',
            icon: 'fas fa-users',
        },
        {
            id: 3,
            url: 'companies',
            name: 'Empresas',
            icon: 'fas fa-building',
        },
        {
            id: 4,
            url: 'profiles',
            name: 'Perfiles',
            icon: 'fas fa-check-square',
        },
        {
            id: 5,
            url: 'products',
            name: 'Productos',
            icon: 'fas fa-hamburger',
        },
    ];

    public viewSelected: Views = window.location.href.split('/')[3] as Views;

    constructor(
        private userService: UserService, 
        private companyService: CompanyService
    ){
        const username: string = sessionStorage.getItem('username')!;

        this.getPermissions(username);
    }

    ngOnInit(): void {
        this.getcompanyInfo();
    }

    private getPermissions(username: string): void {
        this.userService.get_logged_info(username).subscribe({
            next: (response: any) => {
                this.permissions = response.permissions;
            },
            error: (error: any) => {
                console.error("Error: ", error);
            }
        });
    }

    public viewsByPermissions(): View[] {
        const permissionNames = this.permissions.map(permission => permission.name);

        return this.views.filter(view => permissionNames.includes(view.name));
    }

    public setURL(url: string): void {
        window.location.href = url;
    }

    private getcompanyInfo(): void {
        var user_id = Number(sessionStorage.getItem('user_id'));

        if (user_id){
            this.companyService.getCompanyByParam(user_id).subscribe({
                next: (response: any) => {
                    this.company = response;
                },
                error: (error: any) => {
                    console.error("Error: ", error);
                }
            });
        }
    }
}
