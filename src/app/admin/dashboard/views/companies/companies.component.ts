import { Component } from '@angular/core';

import { FooterDasboardComponent } from '../../footer/footer.component';
import { NavbarDashboardComponent } from '../../navbar/navbar.component';
import { SidebarDashboardComponent } from '../../sidebar/sidebar.component';

import { Company } from '@core/interfaces/company';

import { CompanyService } from '@services/company/company.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-company',
    standalone: true,
    imports: [
        NavbarDashboardComponent,
        SidebarDashboardComponent,
        FooterDasboardComponent,
        CommonModule,
    ],
    templateUrl: './companies.component.html',
    styleUrl: './companies.component.css'
})

export default class CompaniesComponent {
    public companies: Company[] = [];
    public paginatedCompanies: Company[] = []; 
    public currentPage = 1;
    public rowsPerPage = 8;
    public totalPages = 0;
    public pages: number[] = [];

    constructor(private companyService: CompanyService){
        this.getCompanies();
        this.updatePagination();
    }

    public getCompanies(): void {
        this.companyService.consultCompanies().subscribe({
            next: (response) => {
                this.companies = response;
                this.updatePagination();
            },
            error: (error) => {
                console.error("Error:", error);
            }
        });
    }

    public updatePagination() {
        const start = (this.currentPage - 1) * this.rowsPerPage;
        const end = Math.min(start + this.rowsPerPage, this.companies.length);
        this.paginatedCompanies = this.companies.slice(start, end);
        this.totalPages = Math.ceil(this.companies.length / this.rowsPerPage);
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    public changePage(page: number) {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
        this.updatePagination();
    }
}
