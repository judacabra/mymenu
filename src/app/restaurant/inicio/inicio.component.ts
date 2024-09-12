import { Component, OnInit } from '@angular/core';

import { HomeService } from '@services/home/home.service';

import { TypeUrl } from '@core/interfaces/type-url';
import { Company } from '@core/interfaces/company';
import { Contact } from '@core/interfaces/contact';

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
    public contact: Contact = {
        numero: 3057506743,
        mensaje : 'Hola%2C%20quiero%20informaci%C3%B3n%20de%20',
    };

    public company: Company = {
        name: 'Devsoftone',
        nit: 0,
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
