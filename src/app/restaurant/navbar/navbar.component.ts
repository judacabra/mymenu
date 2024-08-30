import { Component } from '@angular/core';
import { TypeUrl } from '../../core/interfaces/type-url';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})

export class NavbarComponent {
    public types: Array<TypeUrl> = [
        {
            id: 1,
            name: 'Entradas',
            url: 'restaurant/menu/list#entradas',
        },
        {
            id: 2,
            name: 'Fuertes',
            url: 'restaurant/menu/list#fuertes',
        },
        {
            id: 3,
            name: 'Bebidas',
            url: 'restaurant/menu/list#bebidas',
        },

    ];
}
