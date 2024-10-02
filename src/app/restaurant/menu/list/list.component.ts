import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FooterComponent } from '../../footer/footer.component';
import { NavbarComponent } from '../../navbar/navbar.component';

import { ProductService } from '@services/product/product.service';
import { MenuService } from '@services/menu/menu.service';

import { TypeUrl } from '@core/interfaces/type-url';
import { Product } from '@core/interfaces/product';
import { Company } from '@core/interfaces/company';
import { CompanyService } from '@services/company/company.service';


@Component({
    selector: 'app-list',
    standalone: true,
    imports: [
        NavbarComponent,
        FooterComponent,
    ],
    templateUrl: './list.component.html',
    styleUrl: './list.component.css',
})

export default class ListComponent {
    public pathImg: string = '../../../../../public/img/'; 
    public restaurant: string = ''; 
    
    public company: Company = {
        id: 0,
        name: '',
        img: '',
        nit: 0,
        description: '',
        active: true, 
    };

    public types: TypeUrl[] = [];
    public typeRecommended: TypeUrl[] = [];
    public products: Product[] = [];

    constructor(private route: ActivatedRoute, private productService: ProductService, 
        private menuService:MenuService, private companyService: CompanyService
    ){
        this.route.paramMap.subscribe(params => {
            this.restaurant = params.get('restaurant')!;
        });

        this.getCompanyInfo(this.restaurant);
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
            next: (response) => {
                this.types = response;
            },
            error: (error) => {
                console.error("Error:", error);
            }
        });
    }
    
    public getProductsByCompany(company_id: number): void {
        this.productService.consultProductsByCompany(company_id).subscribe({
            next: (response) => {
                this.products = response; 

                console.log(this.products)
            },
            error: (error) => {
                console.error("Error:", error);
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
            next: (response) => {
                this.typeRecommended = response;
            },
            error: (error) => {
                console.error("Error:", error);
            }
        });
    }

    public truncateText(text: string): string {
        const maxLength: number = 17;
        var result: string;

        if (text.length > maxLength) {
            result = text.substring(0, maxLength) + '...';
        } else {
            result = text;
        }

        return result;
    }

    public getCompanyInfo(restaurant: string): void {
        this.companyService.getCompanyByParam(undefined, restaurant).subscribe({
            next: (response) => {
                this.company = response;

                this.getAllTypesByCompany(response.id);
                this.getTypeRecommendedByCompany(response.id);
                this.getProductsByCompany(response.id);
            },
        
            error: (error) => {
                console.error(error);
            }
        })
    }
}
