import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HomeService } from '@services/home/home.service';
import { CompanyService } from '@services/company/company.service';

import { TypeUrl } from '@core/interfaces/type-url';
import { Company } from '@core/interfaces/company';
import { Contact } from '@core/interfaces/contact';

import { NavbarComponent } from '../navbar/navbar.component';

@Component({
    selector: 'app-inicio',
    standalone: true,
    imports: [
        NavbarComponent
    ],
    templateUrl: './inicio.component.html',
    styleUrl: './inicio.component.css',
})

export default class InicioComponent {
    public path_img: string = './public/img/';
    public restaurant: string = '';

    public contact: Contact = {
        id_company: 1, 
        numero: 3057506743, 
        mensaje : encodeURIComponent(`Hola, quiero información de `), 
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

    constructor(
        private homeService: HomeService, 
        private route: ActivatedRoute, 
        private companyService: CompanyService
    ){
        this.route.paramMap.subscribe(params => {
            this.restaurant = params.get('restaurant')!;
            this.getCompanyInfo(this.restaurant);
        });

        this.getAllType();
    }

    public getAllType(): void {
        this.homeService.consultTypes().subscribe({
            next: (response: any) => {
                this.types = response;
            },
            error: (error: any) => {
                console.error("Error: ", error);
            }
        })
    }

    public getCompanyInfo(name: string): void {
        this.companyService.getCompanyByParam(undefined, name).subscribe({
            next: (response: any) => {
                this.company = response;
            },
        
            error: (error: any) => {
                console.error("Error: ", error);
            }
        })
    }

    public location(type: string, url: string): void {
        console.log(type)

        if (type == 'Contacto') {
            url = url.toString()
                .replace(`"numero"`, this.contact.numero.toString())
                .replace(`"mensaje"`, this.contact.mensaje);

            window.open(url, '_blank');
            return;
        }

        if (type != 'Contacto') {
            url = this.restaurant + url;
        }

        window.location.assign(url);
    }
}
