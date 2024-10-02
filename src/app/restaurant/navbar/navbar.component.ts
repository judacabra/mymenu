import { Component } from '@angular/core';

import { TypeUrl } from '@core/interfaces/type-url';
import { Company } from '@core/interfaces/company';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from '@services/company/company.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})

export class NavbarComponent {
    public path_img: string = '../../../../../public/img/';
    public restaurant: string = '';
    public types: TypeUrl[] = [];

    public company: Company = {
        id: 0,
        name: '',
        img: '',
        nit: 0,
        description: '',
        active: true, 
    };

    constructor(private route: ActivatedRoute, private companyService: CompanyService
    ){
        this.route.paramMap.subscribe(params => {
            this.restaurant = params.get('restaurant')!;
        });

        this.getCompanyInfo(this.restaurant);
    }

    public getCompanyInfo(restaurant: string): void {
        this.companyService.getCompanyByParam(undefined, restaurant).subscribe({
            next: (response) => {
                this.company = response;
            },
        
            error: (error) => {
                console.error(error);
            }
        })
    }
}
