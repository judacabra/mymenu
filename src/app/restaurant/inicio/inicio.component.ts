import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HomeService } from '@services/home/home.service';
import { CompanyService } from '@services/company/company.service';

import { TypeUrl } from '@core/interfaces/type-url';
import { Company } from '@core/interfaces/company';
import { Contact } from '@core/interfaces/contact';

@Component({
    selector: 'app-inicio',
    standalone: true,
    imports: [],
    templateUrl: './inicio.component.html',
    styleUrl: './inicio.component.css',
})

export default class InicioComponent {
    public path_img: string = '../../../../public/img/';
    public restaurant: string = '';

    public contact: Contact = {
        id_company: 1,
        numero: 3057506743,
        mensaje : 'Hola%2C%20quiero%20informaci%C3%B3n%20de%20',
    };

    public company: Company = {
        id: 0,
        name: '',
        img: '',
        nit: 0,
        description: '',
        active: true, 
    };

    public types: TypeUrl[] = [];

    constructor(private homeService: HomeService, private route: ActivatedRoute, private companyService: CompanyService){
        this.route.paramMap.subscribe(params => {
            this.restaurant = params.get('restaurant')!;
            this.getCompanyInfo(this.restaurant);
        });

        this.getAllType();
    }

    public getAllType(): void {
        this.homeService.consultTypes().subscribe({
            next: (response) => {
                this.types = response;
            },
        
            error: (error) => {
                console.error(error);
            }
        })
    }

    public getCompanyInfo(name: string): void {
        this.companyService.getCompanyByParam(undefined, name).subscribe({
            next: (response) => {
                this.company = response;
            },
        
            error: (error) => {
                console.error(error);
            }
        })
    }

    public location(type: string, url: string): void {
        if (type != 'Contacto') {
            url = this.restaurant + url;
        }

        window.location.assign(url);
    }
}
