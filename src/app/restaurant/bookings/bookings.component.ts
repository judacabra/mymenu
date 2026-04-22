import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingMotives } from '@core/interfaces/booking-motives';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'app-bookings',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
    ],
    templateUrl: './bookings.component.html',
    styleUrl: './bookings.component.css'
})

export default class BookingsComponent implements OnInit {
    public form!: FormGroup;

    public apiWpp: string = `https://api.whatsapp.com/send?phone=${3057506743}&text=`;

    public numbers: number[] = Array.from({ length: 50 }, (_, i) => i + 1);

    public isOther: boolean = false;
    public showMotives: boolean = false;

    public motives: BookingMotives[] = [
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

    public options: any[] = [
        { value: 'Si', label: 'Si' },
        { value: 'No', label: 'No' },
    ];

    constructor(private formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.initForm();
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            fullname: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(50)]],
            document: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(11)]],
            cantidad_personas: ['', [Validators.required, Validators.min(1)]], // Cambiado a string vacío
            incluye_deco: ['', Validators.required],
            motive: [''],
            other_motive: [''],
            info_adicional: ['']
        });

        this.form.get('incluye_deco')?.valueChanges.subscribe(() => {
            this.updateValidators();
        });

        this.form.get('motive')?.valueChanges.subscribe(() => {
            this.updateValidators();
        });
    }

    private updateValidators(): void {
        const incluyeDeco: string = this.form.get('incluye_deco')?.value;
        const motive: string = this.form.get('motive')?.value;

        if (incluyeDeco === 'Si') {
            this.form.get('motive')?.setValidators(Validators.required);
        } else {
            this.form.get('motive')?.clearValidators();
        }

        this.form.get('motive')?.updateValueAndValidity({ emitEvent: false });

        if (motive === '6') {
            this.form.get('other_motive')?.setValidators(Validators.required);
        } else {
            this.form.get('other_motive')?.clearValidators();
        }
 
        this.form.get('other_motive')?.updateValueAndValidity({ emitEvent: false });
    }

    public verifyMotive(motive: string): void {
        this.isOther = motive === '6';
        this.updateValidators();
    }

    public verifyDeco(): void {
        this.showMotives = this.form.get('incluye_deco')?.value === 'Si';

        if (!this.showMotives) {
            this.form.get('motive')?.setValue('');
        }

        this.updateValidators();
    }

    onSubmit(): void {
        if (this.form.valid) {
            let msj: string = '*📋 NUEVA RESERVA* \n\n';
            msj += `👤 *Nombre:* ${this.form.value.fullname}\n`;
            msj += `🆔 *Documento:* ${this.form.value.document}\n`;
            msj += `👥 *Cantidad de personas:* ${this.form.value.cantidad_personas}\n`;
            msj += `📺 *Incluye Deco:* ${this.form.value.incluye_deco === 'Si' ? 'Sí ✅' : 'No ❌'}\n`;
            msj += `${this.form.value.incluye_deco === 'Si' ? '🎯 *Motivo:*' : ''} ${this.form.value.incluye_deco === 'Si' 
                    ? this.form.value.motive != '6' 
                        ? this.motives.find(m => m.id == Number(this.form.value.motive))?.name
                        : this.form.value.other_motive
                    : '' }\n`;
            msj += `✨ *Info adicional:* ${this.form.value.info_adicional}\n\n`;
            msj += `🚀 *¡Revisar disponibilidad y confirmar cuanto antes!*`;

            window.open(`${this.apiWpp}${encodeURIComponent(msj)}`, '_blank');
        }
    }
}
