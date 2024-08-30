import { Component, OnInit } from '@angular/core';

import { HomeService } from '@services/home/home.service';

import { TypeUrl } from '../../core/interfaces/type-url';
import { Empresa } from '../../core/interfaces/empresa';
import { Contacto } from '../../core/interfaces/contacto';

@Component({
    selector: 'app-inicio',
    standalone: true,
    imports: [],
    templateUrl: './inicio.component.html',
    styleUrl: './inicio.component.css',
    providers: [
        HomeService
    ],
})

export default class InicioComponent implements OnInit {
    public contacto: Contacto = {
        numero: 3057506743,
        mensaje : 'Hola%2C%20quiero%20informaci%C3%B3n%20de%20',
    };

    public empresa: Empresa = {
        name: 'Devsoftone',
        description: 'Devsoftone es una empresa caleña de desarrollo de software.',
        active: true, 
    };

    public types: TypeUrl[] = [];

    constructor(private homeService: HomeService){}
    
    ngOnInit(): void {
        this._getAllType();
    }

    public _getAllType(): void {
        this.homeService.consultTypes().subscribe({
            next: (response) => {
                this.types = response;
            },
        
            error: (error) => { }
        })
    }

    public location(url: string): void {
        window.location.assign(url);
    }
}
