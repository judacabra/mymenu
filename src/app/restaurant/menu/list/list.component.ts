import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, HostListener, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgClass } from '@angular/common';

import { FooterComponent } from '../../footer/footer.component';
import { NavbarComponent } from '../../navbar/navbar.component';

import { ProductService } from '@services/product/product.service';
import { MenuService } from '@services/menu/menu.service';

import { TypeUrl } from '@core/interfaces/type-url';
import { Product } from '@core/interfaces/product';
import { Company } from '@core/interfaces/company';
import { CompanyService } from '@services/company/company.service';
import { environment } from 'src/environments';

import Format from 'src/app/utils/format';
@Component({
    selector: 'app-list',
    standalone: true,
    imports: [
        NavbarComponent,
        FooterComponent,
        NgClass
    ],
    templateUrl: './list.component.html',
    styleUrl: './list.component.css',
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
    ]
})

export default class ListComponent {
    @ViewChildren('typeElement') typeElements!: QueryList<ElementRef>;

    public path_img: string = './public/img/';
    public path_server: string = environment.imgUrl;

    public restaurant: string = '';

    public parts: string[] = window.location.href.split('/');
    public location: string = `${this.parts[0]}/${this.parts[1]}/${this.parts[2]}/${this.parts[3]}/${this.parts[4]}/`;

    public company: Company = {
        id: 0,
        name: '',
        img: '',
        nit: 0,
        description: '',
        active: true,
    };

    public formater = new Format();

    public types: TypeUrl[] = [];
    public typeRecommended: TypeUrl[] = [];
    public products: Product[] = [];

    public positionTop: boolean = true;

    public typeSelected: string = "";

    constructor(
        private route: ActivatedRoute,
        private productService: ProductService,
        private menuService: MenuService,
        private companyService: CompanyService
    ) {
        this.route.paramMap.subscribe(params => {
            this.restaurant = params.get('restaurant')!;
        });

        this.getCompanyInfo(this.restaurant);
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        this.detectCurrentType();

        this.positionTop = (window.scrollY > 0) ? false : true;
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.route.fragment.subscribe(fragment => {
                if (fragment) {
                    const element = document.getElementById(fragment);

                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        }, 200);
    }

    public getAllTypesByCompany(company_id: number): void {
        this.menuService.consultTypesByCompany(company_id).subscribe({
            next: (response: any) => {
                this.types = response;
            },
            error: (error: any) => {
                console.error("Error: ", error);
            }
        });
    }

    public getProductsByCompany(company_id: number): void {
        this.productService.consultProductsByCompany(company_id).subscribe({
            next: (response: any) => {
                this.products = response;
            },
            error: (error: any) => {
                console.error("Error: ", error);
            }
        });
    }

    public productsByType(id: number): Product[] {
        return this.products.filter(product => product.id_type === id);
    }

    public productsRecommended(): Product[] {
        return this.products.filter(product => product.recommended === 'SI');
    }

    public getTypeRecommendedByCompany(company_id: number): void {
        this.productService.typeRecommendedByCompany(company_id).subscribe({
            next: (response: any) => {
                this.typeRecommended = response;
            },
            error: (error: any) => {
                console.error("Error: ", error);
            }
        });
    }

    public getCompanyInfo(restaurant: string): void {
        this.companyService.getCompanyByParam(undefined, restaurant).subscribe({
            next: (response: any) => {
                this.company = response;

                this.getAllTypesByCompany(response.id);
                this.getTypeRecommendedByCompany(response.id);
                this.getProductsByCompany(response.id);
            },

            error: (error: any) => {
                console.error("Error: " + error);
            }
        })
    }

    public setType(t: string): void {
        this.typeSelected = t;
    }

    private detectCurrentType(): void {
        if (!this.typeElements) return;

        let currentType: any = null;
        let minDistance: number = Infinity;

        this.typeElements.forEach((typeRef) => {
            const element: any = typeRef.nativeElement;
            const rect: any = element.getBoundingClientRect();
            const viewportCenter: number = window.innerHeight / 2.5;
            
            const elementCenter: number = rect.top + rect.height / 2.5;
            const distance: number = Math.abs(elementCenter - viewportCenter);
            
            if (distance < minDistance) {
                minDistance = distance;
                currentType = element;
            }
        });

        if (currentType && this.typeSelected != currentType.id) {
            this.typeSelected = currentType.id;
        }
    }
}
