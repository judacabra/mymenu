import { CompaniesInfo } from './../../core/interfaces/companiesInfo';
import { Component } from '@angular/core';

import { NavbarDashboardComponent } from './navbar/navbar.component';
import { SidebarDashboardComponent } from './sidebar/sidebar.component';
import { FooterDasboardComponent } from './footer/footer.component';

import { CompanyService } from '@services/company/company.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        NavbarDashboardComponent,
        SidebarDashboardComponent,
        FooterDasboardComponent,
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})

export default class DashboardComponent {
    public companiesInfo: CompaniesInfo = {
        total: 0,
        active: 0,
        inactive: 0,
        porcent_active: 0,
        porcent_inactive: 0,
    }

    constructor (private companyService: CompanyService){
        this.getCompaniesInfo();
    }

    public getCompaniesInfo():void {
        this.companyService.getCompaniesInfo().subscribe({
            next: (response) => {
                this.companiesInfo.total = response.total;
                this.companiesInfo.active = response.active;
                this.companiesInfo.inactive = response.total - response.active;
                this.companiesInfo.porcent_active = Math.round((response.active / response.total) * 100);
                this.companiesInfo.porcent_inactive = Math.round((this.companiesInfo.inactive / response.total) * 100);
            },
        
            error: (error) => { 
                console.error(error)
            }
        })
    }
}
