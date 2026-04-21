import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarDashboardComponent } from '../../navbar/navbar.component';
import { SidebarDashboardComponent } from '../../sidebar/sidebar.component';
import { FooterDasboardComponent } from '../../footer/footer.component';
import { FormProductComponent } from './form/form.component';

import { ProductService } from '@services/product/product.service';
import { AlertService } from '@services/alertService/alert.service';

import { Product } from '@core/interfaces/product';
import { Mode } from '@core/interfaces/mode';

import { environment } from 'src/environments';

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
    private initialProduct: Product = {
        id: 0,
        name: '',
        description: '',
        recommended: '',
        id_company: 0,
        id_type: 0,
        img: '',
        price: 0,
        stock: 0,
        status: true,
    }

    public product: Product = this.initialProduct;

    public path_img: string = './public/img/';
    public path_server: string = environment.imgUrl;

    public mode: Mode = {
        action: '',
        actioner: '',
    }

    public products: Product[] = [];
    public paginatedProducts: Product[] = [];
    public originalProducts: Product[] = [];
    public currentPage = 1;
    public rowsPerPage = 8;
    public totalPages = 0;
    public pages: number[] = [];

    constructor(
        private productService: ProductService,
        private alertService: AlertService,
    ) {
        this.getProducts(Number(sessionStorage.getItem('user_id')));
        this.updatePagination();
    }

    public getProducts(user_id: number): void {
        this.productService.consultProductsByUser(user_id).subscribe({
            next: (response: any) => {
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
        this.originalProducts = this.products.slice(start, end);
        this.totalPages = Math.ceil(this.products.length / this.rowsPerPage);
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    public changePage(page: number) {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
        this.updatePagination();
    }

    public setMode(mode: string, id?: number): void {
        if (mode == 'Insertar') {
            this.mode.action = 'Nuevo';
            this.mode.actioner = 'Insertar';

            this.product = this.initialProduct;
        }

        if (mode == 'Modificar') {
            if (id) this.getProductById(id);

            this.mode.action = 'Actualizar';
            this.mode.actioner = 'Modificar';
        }
    }

    public searchProduct(event: Event): void {
        const inputElement: HTMLInputElement = event.target as HTMLInputElement;
        const searchValue: string = inputElement.value.trim(); // trim() directamente aquí

        if (!searchValue) {
            this.paginatedProducts = [...this.originalProducts];
            return;
        }

        this.paginatedProducts = this.originalProducts.filter(p =>
            p.id === Number(searchValue) ||
            p.name.toLowerCase().includes(searchValue.toLowerCase())
        );
    }

    public async verifyDeleteProduct(id: number): Promise<void> {
        if (await this.alertService.confirm(`Seguro que desea eliminar el producto #${id}?`)) {
            this.tryDeleteProduct(id);
        }
    }

    private tryDeleteProduct(id: number): void {
        this.productService.deleteProductById(id).subscribe({
            next: () => {
                window.location.reload();
            },
            error: (error: any) => {
                console.error("Error: ", error);
            }
        });
    }

    public getProductById(id: number): void {
        this.productService.consultProductById(id).subscribe({
            next: (response: any) => {
                this.product = response;
            },
            error: (error: any) => {
                console.error("Error: ", error);
            }
        });
    }
}
