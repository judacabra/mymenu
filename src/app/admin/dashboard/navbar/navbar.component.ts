import { Component, Input } from '@angular/core';

import { AuthService } from '@services/authService/auth.service';
import { UserService } from '@services/user/user.service';

import { UserLogged } from '@core/interfaces/user_logged';


@Component({
    selector: 'app-dashboard-navbar',
    standalone: true,
    imports: [],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})

export class NavbarDashboardComponent {
    @Input() title: string = '';

    public path_img: string = '../../../public/img/';

    public user_logged: UserLogged = {
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

    constructor(private userService: UserService, private authService: AuthService){
        const username: string = sessionStorage.getItem('username')!;
        this.getLoggedInfo(username);
    }

    public getLoggedInfo(username: string):void {
        this.userService.get_logged_info(username).subscribe({
            next: (response) => {
                this.user_logged = response;
                sessionStorage.setItem('user_id', response.id.toString());
            },
            error: (error) => {
                console.error("Error:", error);
            }
        });
    }

    public noEvent(event: Event):void {
        event.stopPropagation();
    }

    public setLogOut(): void {
        this.authService.logout();
        this.authService.isNotAuthorized();
    }
}
