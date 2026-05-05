import { Component, Input } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { environment } from 'src/environments';

@Component({
    selector: 'app-table',
    standalone: true,
    imports: [
    CommonModule,
    NgClass,
],
    templateUrl: './table.component.html',
    styleUrl: './table.component.css'
})

export class TableComponent {
    @Input() titles: any[] = [];
    @Input() tableContent: any[] = [];
    @Input() columnsCount: number = 0;

    @Input() pages: number[] = [];
    @Input() totalPages: number = 0;
    @Input() currentPage: number = 1;
    @Input() onChangePage: (page: number) => void = (page: number) => {};

    public path_img: string = './public/img/';
    public path_server: string = environment.imgUrl;
            
    constructor() {}

    public getIconHtml(label: string): string {
        const html = label === 'true' 
        ? '<i class="fas fa-check text-success fs-1" title="Activo"></i>'
        : '<i class="fas fa-times text-danger fs-1" title="Inactivo"></i>';

        return html;
    }
}
