import { Component } from '@angular/core';

import { TypeFood } from '../../../core/interfaces/type-food';
import { Product } from '../../../core/interfaces/product';

import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';

@Component({
    selector: 'app-list',
    standalone: true,
    imports: [
        NavbarComponent,
        FooterComponent,
    ],
    templateUrl: './list.component.html',
    styleUrl: './list.component.css'
})

export default class ListComponent {
    public types: Array<TypeFood> = [
        {
            id: 1,
            name: 'Entradas',
            url: 'entradas',
            products: [
                {
                    id: 1,
                    name: 'Tostaditas',
                    description: '6 tostaditas con hogao para compartir.',
                    type: 1,
                    img: 'img/product.jpg',
                    price: 15000,
                },
                {
                    id: 2,
                    name: 'Nachos',
                    description: 'Nachos con pico de gallo.',
                    type: 1,
                    img: 'img/product2.jpg',
                    price: 20000,
                },
                {
                    id: 3,
                    name: 'Yuquitas',
                    description: 'Palitos de yuca con queso apanados.',
                    type: 1,
                    img: 'img/product3.jpg',
                    price: 10000,
                },
                {
                    id: 4,
                    name: 'Maices',
                    description: 'Trozos de mazorca asada, cubiertos de mantequilla.',
                    type: 1,
                    img: 'img/product4.jpg',
                    price: 15000,
                },
                {
                    id: 5,
                    name: 'Canastica valluna',
                    description: 'Cositas del valle.',
                    type: 1,
                    img: 'img/product4.jpg',
                    price: 15000,
                },
            ],
        },
        {
            id: 2,
            name: 'Fuertes',
            url: 'fuertes',
            products: [
                {
                    id: 5,
                    name: 'Chuleta',
                    description: 'Milanesa de pollo o cerdo, con papa francesa.',
                    type: 1,
                    img: 'img/product5.jpg',
                    price: 25000,
                },
                {
                    id: 6,
                    name: 'Salchipapa',
                    description: 'Salchicha ranchera, papa francesa o criolla.',
                    type: 1,
                    img: 'img/product6.jpg',
                    price: 10000,
                },
                {
                    id: 7,
                    name: 'Pizza',
                    description: 'Pan artesanal, peperoni y bordes de queso.',
                    type: 1,
                    img: 'img/product7.jpg',
                    price: 20000,
                },
                {
                    id: 8,
                    name: 'Lasagna mixta',
                    description: 'Carne molida, pollo desmechado, salsa bechamel.',
                    type: 1,
                    img: 'img/product8.jpg',
                    price: 17000,
                },
            ],
        },
        {
            id: 3,
            name: 'Bebidas',
            url: 'bebidas',
            products: [
                {
                    id: 9,
                    name: 'Limococo',
                    description: 'Refrescante limonada de coco.',
                    type: 1,
                    img: 'img/product9.jpg',
                    price: 25000,
                },
                {
                    id: 10,
                    name: 'Hit',
                    description: 'Jugo hit de 400 ML.',
                    type: 1,
                    img: 'img/product10.jpg',
                    price: 10000,
                },
                {
                    id: 11,
                    name: 'Cocacola',
                    description: 'Gaseosa de 300 ML.',
                    type: 1,
                    img: 'img/product11.jpg',
                    price: 20000,
                },
                {
                    id: 12,
                    name: 'Agua',
                    description: 'Botella de agua sin gas de 300 ML.',
                    type: 1,
                    img: 'img/product12.jpg',
                    price: 17000,
                },
            ],
        },
    ];

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
