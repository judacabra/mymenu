import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';

import { CompanyService } from '@services/company/company.service';

import { Company } from '@core/interfaces/company';

export interface Section{
    name: string,
    url: string
}

@Component({
    selector: 'app-webpage',
    standalone: true,
    imports: [],
    templateUrl: './webpage.component.html',
    styleUrl: './webpage.component.css',
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
    ]
})

export default class WebpageComponent implements OnInit {
    public path_img: string = '../../../../../public/img/';
    public logo_company: string = 'mm-logo.png';
    public bg_1: string = 'bg-home.png';
    public companies: Company[] = [];

    public sections: Section[] = [
        {
            name: 'INICIO',
            url: 'index#',
        },
        {
            name: 'BENEFICIOS',
            url: 'index#benefits',
        },
        {
            name: 'CLIENTES',
            url: 'index#clients',
        },
        {
            name: 'CONTACTO',
            url: 'index#contact',
        },
    ];

    constructor(private companyService: CompanyService){
        this.getCompanies();
    }

    ngOnInit(): void {
        register();
    }

    public goToLogin(): void{
        window.location.href = '/admin';
    }


    public getCompanies(): void {
        this.companyService.consultCompanies().subscribe({
            next: (response) => {
                this.companies = response;
            },
            error: (error) => {
                console.error("Error:", error);
            }
        });
    }
}
