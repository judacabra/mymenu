import { Component } from '@angular/core';

import { FooterDasboardComponent } from '../../footer/footer.component';
import { NavbarDashboardComponent } from '../../navbar/navbar.component';
import { SidebarDashboardComponent } from '../../sidebar/sidebar.component';

import { Company } from '@core/interfaces/company';

import { CompanyService } from '@services/company/company.service';

@Component({
    selector: 'app-company',
    standalone: true,
    imports: [
        NavbarDashboardComponent,
        SidebarDashboardComponent,
        FooterDasboardComponent
    ],
    templateUrl: './company.component.html',
    styleUrl: './company.component.css'
})

export default class CompanyComponent {
    public company: Company = {
        name: '',
        nit: 0,
        address: '',
        active: true,
        description: '',
    };

    constructor(private companyService: CompanyService){
        this.consultCompany();
    }

    public consultCompany(): void {
        this.companyService.consultCompany().subscribe({
            next: (response) => {
                this.company = response[0];
            },
        
            error: (error) => { }
        })
    }
}
