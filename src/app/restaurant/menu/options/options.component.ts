import { Company } from '@core/interfaces/company';
import { Component } from '@angular/core';

import { MenuService } from '@services/menu/menu.service';

import { TypeUrl } from '@core/interfaces/type-url';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from '@services/company/company.service';

@Component({
    selector: 'app-options',
    standalone: true,
    imports: [],
    templateUrl: './options.component.html',
    styleUrl: './options.component.css',
})

export class OptionsComponent {
    public company: Company = {
        id: 0,
        name: '',
        img: '',
        nit: 0,
        description: '',
        active: true, 
    };

    public pathUrl: string = '/menu/list/#';
    public restaurant: string = '';
    public types: TypeUrl[] = [];

    constructor(private menuService: MenuService, private route: ActivatedRoute, private companyService: CompanyService){
        this.route.paramMap.subscribe(params => {
            this.restaurant = params.get('restaurant')!;

            this.getCompanyInfo(this.restaurant);
        });
    }

    public getCompanyInfo(name: string): void {
        this.companyService.getCompanyByParam(undefined, name).subscribe({
            next: (response) => {
                this.company = response;

                this.getAllTypesByCompany(response.id);
            },
            error: (error) => {
                console.error(error);
            }
        })
    }

    public getAllTypesByCompany(company_id: number): void {
        this.menuService.consultTypesByCompany(company_id).subscribe({
            next: (response) => {
                this.types = response;
            },
            error: (error) => { 
                console.error('Error:' + error);
            }
        })
    }
}
