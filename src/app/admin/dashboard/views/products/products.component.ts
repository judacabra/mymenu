import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewTitle } from '@core/types/views';
import { TableContent, TableTitle } from '@core/interfaces/table';
import { TableComponent } from 'src/app/shared/table/table.component';

@Component({
    selector: 'app-products',
    standalone: true,
    imports: [
        NavbarDashboardComponent,
        SidebarDashboardComponent,
        FooterDasboardComponent,
        FormProductComponent,
        CommonModule,
        TableComponent,
    ],
    templateUrl: './products.component.html',
    styleUrl: './products.component.css',
})

export default class ProductsComponent implements OnInit, OnDestroy {
    public title: ViewTitle = "Productos";

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

    private querySub: Subscription | undefined;

    public product: Product = this.initialProduct;

    public path_img: string = './public/img/';
    public path_server: string = environment.imgUrl;

    public tableContent: TableContent[] = [];

    public tableTitles: TableTitle[] = [
        { name: "NOMBRE", classes: "w-20 rnd-first-top" },
        { name: "DESCRIPCION", classes: "text-start w-25" },
        { name: "PRECIO", classes: "text-center w-10" },
        { name: "STOCK", classes: "text-center w-10" },
        { name: "IMAGEN", classes: "text-center w-15" },
        { name: "ESTADO", classes: "text-center w-10" },
        { name: "", classes: "text-center w-10 rnd-last-top" },
    ];

    public mode: Mode = {
        action: '',
        actioner: '',
    }

    public products: Product[] = [];
    public filteredProducts: Product[] = [];
    public paginatedProducts: Product[] = [];
    public originalProducts: Product[] = [];

    public columnsCount: number = 7;
    public currentPage: number = 1;
    public rowsPerPage: number = 7;
    public totalPages: number = 0;
    public pages: number[] = [];

    private userId: number;

    constructor(
        private productService: ProductService,
        private alertService: AlertService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        this.userId = Number(sessionStorage.getItem('user_id'));
        this.getProducts(this.userId);
    }

    ngOnInit() {
        this.actionValidator();
    }

    public getProducts(user_id: number): void {
        this.productService.consultProductsByUser(user_id).subscribe({
            next: (response: any) => {
                this.products = response;

                this.loadProducts();
            },
            error: (error) => {
                console.error("Error:", error);
            }
        });
    }

    private loadProducts(): void {
        this.filteredProducts = [...this.products];

        this.updatePagination();
    }

    public updatePagination(): void {
        const start: number = (this.currentPage - 1) * this.rowsPerPage;
        const end: number = Math.min(start + this.rowsPerPage, this.filteredProducts.length);

        this.paginatedProducts = this.filteredProducts.slice(start, end);
        this.totalPages = Math.ceil(this.filteredProducts.length / this.rowsPerPage);
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

        this.tableContent = [];
        this.paginatedProducts.forEach((p: Product) => {
            const objProduct: TableContent = {
                columns: [
                    { id: p.id!.toString(), label: p.name, classes: 'text-start' },
                    { id: p.id!.toString(), label: p.description, classes: 'text-start' },
                    { id: p.id!.toString(), label: p.price.toString(), classes: 'text-center' },
                    { id: p.id!.toString(), label: p.stock.toString(), classes: 'text-center' },
                    { id: p.id!.toString(), label: p.img?.toString() || '', classes: 'text-center' },
                    { id: p.id!.toString(), label: p.status?.toString() || '', classes: 'text-center' },
                ],
                editRow: true,
                deleteRow: true,
                idForm: "productsForm",
                onEdit: () => this.setMode('Modificar', p.id!),
                onDelete: () => this.verifyDeleteProduct(p.id!),
            };

            this.tableContent.push(objProduct);
        });
    }

    public changePage = (page: number): void => {
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
        const searchValue: string = inputElement.value.trim();
        
        if (!searchValue || searchValue == "") {
            this.filteredProducts = [...this.products];
        } else {
            this.filteredProducts = this.products.filter(product => {
                const matchById: boolean = !isNaN(Number(searchValue)) && product.id === Number(searchValue);
                const matchByName: boolean = product.name.toLowerCase().includes(searchValue.toLowerCase());

                return matchById || matchByName;
            });
        }
        
        this.currentPage = 1;

        this.updatePagination();
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
    
    private actionValidator(): void {
        this.querySub = this.route.queryParams.subscribe((params) => {
            const created = String(params['created'] || '').trim();
            const updated = String(params['updated']|| '').trim();
            const failed = created == '0' || updated == '0';

            if (
                (!created || created === '') &&
                (!updated || updated === '')
            ) return;

            this.getProducts(this.userId);

            this.closeModal();

            this.router.navigate([], {
                relativeTo: this.route,
                replaceUrl: true,
                queryParams: {},
            });

            let msj: string = `Producto ${created ? 'creado' : 'actualizado'} exitosamente`;
            if (failed) msj = `Error al ${created ? 'crear' : 'actualizar'} el producto.`
            
            this.alertService.notification(msj, !failed);
        });
    }

    public closeModal(): void { 
        document.getElementById('close-modal')!.click();
    }

    ngOnDestroy() {
        if (this.querySub) {
            this.querySub.unsubscribe();
        }
    }
}
