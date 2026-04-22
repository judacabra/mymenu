import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CompanyService } from '@services/company/company.service';

import { OptionsComponent } from './options/options.component';

import { Company } from '@core/interfaces/company';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [
        NavbarComponent,
        OptionsComponent,
    ],
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.css'
})

export default class MenuComponent {
    public path_img: string = './public/img/';
    public restaurant: string = '';
    
    public company: Company = {
        id: 0,
        name: '',
        img: '',
        nit: 0,
        description: '',
        active: true, 
    };

    constructor(
        private route: ActivatedRoute, 
        private companyService: CompanyService
    ){
        this.route.paramMap.subscribe(params => {
            this.restaurant = params.get('restaurant')!;

            this.getCompanyInfo(this.restaurant);
        });
    }

    public getCompanyInfo(restaurant: string): void {
        this.companyService.getCompanyByParam(undefined, restaurant).subscribe({
            next: (response: any) => {
                this.company = response;
            },
            error: (error: any) => {
                console.error("Error: ", error);
            }
        })
    }
}
