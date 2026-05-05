import { Component, Input } from '@angular/core';

import { AuthService } from '@services/authService/auth.service';
import { UserService } from '@services/user/user.service';

import { UserLogged } from '@core/interfaces/user_logged';
import { AlertService } from '@services/alertService/alert.service';
import { ViewTitle } from '@core/types/views';


@Component({
    selector: 'app-dashboard-navbar',
    standalone: true,
    imports: [],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})

export class NavbarDashboardComponent {
    @Input() title: ViewTitle = '';

    public path_img: string = './public/img/';

    public user: UserLogged = {
        id: 0,
        name: '',
        email: '',
        company_name: '',
        profile_name: '',
        permissions: [
            {
                id: 0,
                name: '',
            }
        ]
    }

    constructor(
        private userService: UserService, 
        private authService: AuthService,
        private alertService: AlertService,
    ){
        const id: string = sessionStorage.getItem('user_id')!;
        this.getLoggedInfo(id);
    }

    public getLoggedInfo(id: string): void {
        this.userService.getLoggedInfo(id).subscribe({
            next: (response: any) => {
                this.user = response;
            },
            error: (error: any) => {
                console.error("Error: ", error);
            }
        });
    }

    public async setLogOut(): Promise<void> {
        if (await this.alertService.confirm(`¿Desea cerrar la sesión?`, 'Si, salir')) {
            this.authService.logout();
            this.authService.isNotAuthorized();
        }
    }
}
