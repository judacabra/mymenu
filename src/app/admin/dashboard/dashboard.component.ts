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
                this.setDashboardInfo(response);
            },
        
            error: (error) => { 
                console.error(error)
            }
        })
    }

    public setDashboardInfo(data: any):void {
        this.companiesInfo.total = data.total;
        this.companiesInfo.active = data.active;
        this.companiesInfo.inactive = data.total - data.active;
        this.companiesInfo.porcent_active = Math.round((data.active / data.total) * 100);
        this.companiesInfo.porcent_inactive = Math.round((this.companiesInfo.inactive / data.total) * 100);
    }
}
