import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarDashboardComponent } from '../../navbar/navbar.component';
import { SidebarDashboardComponent } from '../../sidebar/sidebar.component';
import { FooterDasboardComponent } from '../../footer/footer.component';

import { ListService } from '@services/list/list.service';
import { Product } from '@core/interfaces/product';

@Component({
    selector: 'app-products',
    standalone: true,
    imports: [
        NavbarDashboardComponent,
        SidebarDashboardComponent,
        FooterDasboardComponent,
        CommonModule,
    ],
    templateUrl: './products.component.html',
    styleUrl: './products.component.css',
    providers: [
        ListService
    ],
})

export default class ProductsComponent {
    public products: Product[] = [];
    public paginatedProducts: Product[] = []; 
    public currentPage = 1;
    public rowsPerPage = 8;
    public totalPages = 0;
    public pages: number[] = [];

    constructor(private listService: ListService) {
        this.getProducts();
        this.updatePagination();
    }

    public getProducts(): void {
        this.listService.consultProducts().subscribe({
            next: (response) => {
                this.products = response;
                this.updatePagination();
            },
            error: (error) => {
                console.error("Error:", error);
            }
        });
    }

    public updatePagination() {
        const start = (this.currentPage - 1) * this.rowsPerPage;
        const end = Math.min(start + this.rowsPerPage, this.products.length);
        this.paginatedProducts = this.products.slice(start, end);
        this.totalPages = Math.ceil(this.products.length / this.rowsPerPage);
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    public changePage(page: number) {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
        this.updatePagination();
    }
}
