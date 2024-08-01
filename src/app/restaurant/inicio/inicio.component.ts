import { Component } from '@angular/core';

import { TypeUrl } from '../../core/interfaces/type-url';
import { Empresa } from '../../core/interfaces/empresa';
import { Contacto } from '../../core/interfaces/contacto';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})

export default class InicioComponent {
    public contacto: Contacto = {
        numero: 3057506743,
        mensaje : 'Hola%2C%20quiero%20informaci%C3%B3n%20de%20',
    };

    public empresa: Empresa = {
        name: 'Devsoftone',
        description: 'Devsoftone es una empresa caleña de desarrollo de software.',
        active: true, 
    };

    public types: Array<TypeUrl> = [
        {
            id: 1,
            name: 'Carta',
            url: 'restaurant/menu'
        },
        {
            id: 2,
            name: 'Reservas',
            url: 'restaurant/bookings'
        },
        {
            id: 3,
            name: 'Contacto',
            url: `https://api.whatsapp.com/send?phone=57${this.contacto.numero}&text=${this.contacto.mensaje}`,
        },
    ];

    public location(url: string): void {
        window.location.assign(url);
    }
}
