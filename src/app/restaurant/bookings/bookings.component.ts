import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Empresa } from '../../core/interfaces/empresa';
import { BookingMotives } from '../../core/interfaces/booking-motives';

@Component({
    selector: 'app-bookings',
    standalone: true,
    imports: [
        CommonModule,
    ],
    templateUrl: './bookings.component.html',
    styleUrl: './bookings.component.css'
})

export default class BookingsComponent {
    public numbers: Array<number> = Array.from({ length: 100 }, (_, i) => i + 1);

    public isOther: boolean = false;

    public empresa: Empresa = {
        name: 'Devsoftone',
        description: 'Devsoftone es una empresa caleña de desarrollo de software.',
        active: true, 
    };

    public motives: Array<BookingMotives> = [
        {
            id: 1,
            name: 'Cumpleaños',
        },
        {
            id: 2,
            name: 'Aniversario',
        },
        {
            id: 3,
            name: 'Graduación',
        },
        {
            id: 4,
            name: 'Propuesta matrimonial',
        },
        {
            id: 5,
            name: 'Celebración familiar',
        },
        {
            id: 6,
            name: 'Otro',
        },
    ];

    public verifyMotive(motive: string): void {
        if (motive.trim() == '6') {
            this.isOther = true;
        } else {
            this.isOther = false;
        }
    }
}
