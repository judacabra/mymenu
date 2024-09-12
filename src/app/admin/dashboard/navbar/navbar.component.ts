import { Component, Input } from '@angular/core';

export interface User {
    id: number,
    name: string,
    email: string,
    password: string,
    username: string,
}

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

    public user: User = {
        id: 1,
        name: 'Julián Caicedo',
        email: 'admin@devsoftone.com',
        password: 'Devsoftone2012*',
        username: 'admin',
    }
}
