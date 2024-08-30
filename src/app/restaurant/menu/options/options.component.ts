import { Component, OnInit } from '@angular/core';

import { MenuService } from '@services/menu/menu.service';

import { TypeUrl } from '@core/interfaces/type-url';

@Component({
    selector: 'app-options',
    standalone: true,
    imports: [],
    templateUrl: './options.component.html',
    styleUrl: './options.component.css',
    providers: [
        MenuService
    ],
})

export class OptionsComponent implements OnInit {
    public types: TypeUrl[] = [];
    public pathUrl: string = '/restaurant/menu/list/#';

    constructor(private menuService: MenuService){}
    
    ngOnInit(): void {
        this._getAllType();
    }

    public _getAllType(): void {
        this.menuService.consultTypes().subscribe({
            next: (response) => {
                this.types = response;
            },
        
            error: (error) => { 
                console.error('Error:' + error);
            }
        })
    }
}
