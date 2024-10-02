import { CompanyService } from './../../../services/company/company.service';
import { Component } from '@angular/core';

import { UserService } from '@services/user/user.service';

import { Permission } from '@core/interfaces/permission';
import { View } from '@core/interfaces/view';
import { Company } from '@core/interfaces/company';

@Component({
    selector: 'app-dashboard-sidebar',
    standalone: true,
    imports: [],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})

export class SidebarDashboardComponent {
    public path_img: string = '../../../public/img/';

    public company: Company = {
        id: 0,
        name: '',
        description: '',
        nit: 0,
        active: true,
    }
    
    public permissions: Permission[] = [];

    public views: View[] = [
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
            url: 'companys',
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
    ]

    constructor(private userService: UserService, private companyService: CompanyService){
        const username: string = sessionStorage.getItem('username')!;
        this.getPermissions(username);
        this.getcompanyInfo();
    }

    public getPermissions(username: string):void {
        this.userService.get_logged_info(username).subscribe({
            next: (response) => {
                this.permissions = response.permissions;
            },
            error: (error) => {
                console.error("Error:", error);
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

    public getcompanyInfo(): void {
        var user_id = Number(sessionStorage.getItem('user_id'));

        this.companyService.getCompanyByParam(user_id).subscribe({
            next: (response) => {
                this.company = response;
            },
            error: (error) => {
                console.error("Error:", error);
            }
        });
    }
}
