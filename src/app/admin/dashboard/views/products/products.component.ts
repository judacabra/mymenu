import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarDashboardComponent } from '../../navbar/navbar.component';
import { SidebarDashboardComponent } from '../../sidebar/sidebar.component';
import { FooterDasboardComponent } from '../../footer/footer.component';
import { FormProductComponent } from './form/form.component';

import { ProductService } from '@services/product/product.service';

import { Product } from '@core/interfaces/product';
import { Mode } from '@core/interfaces/mode';

@Component({
    selector: 'app-products',
    standalone: true,
    imports: [
        NavbarDashboardComponent,
        SidebarDashboardComponent,
        FooterDasboardComponent,
        FormProductComponent,
        CommonModule,
    ],
    templateUrl: './products.component.html',
    styleUrl: './products.component.css',
})

export default class ProductsComponent {
    public product: Product = {
        id: 0,
        name: '',
        description: '',
        recommended: 'NO',
        id_company: 0,
        id_type: 0,
        img: '',
        price: 0,
        stock: 0,
    }
    
    public path_img: string = '../../../../public/img/';
    public mode: Mode = {
        action: '',
        actioner: '',
    }

    public products: Product[] = [];
    public paginatedProducts: Product[] = []; 
    public currentPage = 1;
    public rowsPerPage = 8;
    public totalPages = 0;
    public pages: number[] = [];

    constructor(private productService: ProductService) {
        this.getProducts(Number(sessionStorage.getItem('user_id')));
        this.updatePagination();
    }

    public getProducts(user_id: number): void {
        this.productService.consultProductsByUser(user_id).subscribe({
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

    public setMode(mode: string, id?: number):void {
        console.log(mode)

        if (mode == 'Insertar') {
            this.mode.action = 'Nuevo';
            this.mode.actioner = 'Insertar';
        } 
        if (mode == 'Modificar'){
            if (id){
                this.getProductById(id);
            }

            this.mode.action = 'Actualizar';
            this.mode.actioner = 'Modificar';
        }
    }

    public verifyDeleteProduct(id: number):void {

    }

    public getProductById(id: number):void {
        this.productService.consultProductById(id).subscribe({
            next: (response) => {
                this.product = response;
            },
            error: (error) => {
                console.error("Error:", error);
            }
        });
    }
}
