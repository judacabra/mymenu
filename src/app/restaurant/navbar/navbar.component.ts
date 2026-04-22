import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CompanyService } from '@services/company/company.service';

import { TypeUrl } from '@core/interfaces/type-url';
import { Company } from '@core/interfaces/company';
import { environment } from 'src/environments';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})

export class NavbarComponent {
    @ViewChild('operation') dropdownElement!: ElementRef;

    public path_img: string = './public/img/';
    public path_server: string = environment.imgUrl;
    public restaurant: string = '';

    public company: Company = {
        id: 0,
        name: '',
        img: '',
        nit: 0,
        description: '',
        active: true,
    };

    public expanded: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private companyService: CompanyService
    ) {
        this.route.paramMap.subscribe(params => {
            this.restaurant = params.get('restaurant')!;
        });

        this.getCompanyInfo(this.restaurant);
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
