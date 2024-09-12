import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ListService } from '@services/list/list.service';

import { TypeUrl } from '@core/interfaces/type-url';
import { Product } from '@core/interfaces/product';

import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { MenuService } from '@services/menu/menu.service';

@Component({
    selector: 'app-list',
    standalone: true,
    imports: [
        NavbarComponent,
        FooterComponent,
    ],
    templateUrl: './list.component.html',
    styleUrl: './list.component.css',
    providers: [
        ListService
    ],
})

export default class ListComponent implements OnInit {
    public pathImg: string = '../../../../public/'; 
    public types: TypeUrl[] = [];
    public typeRecommended: TypeUrl[] = [];
    public products: Product[] = [];

    constructor(private route: ActivatedRoute, private listService: ListService, private menuService:MenuService){}

    ngOnInit(): void {
        this.getAllTypes();
        this.getTypeRecommended();
        this.getProducts();
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

    public getAllTypes(): void {
        this.menuService.consultTypes().subscribe({
            next: (response) => {
                this.types = response;
            },
            error: (error) => {
                console.error("Error:", error);
            }
        });
    }
    
    public getProducts(): void {
        this.listService.consultProducts().subscribe({
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

    public getTypeRecommended(): void {
        this.listService.typeRecommended().subscribe({
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
}
