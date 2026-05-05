import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AlertService } from '@services/alertService/alert.service';
import { SmtpService } from '@services/smtp/smtp.service';

import { BookingMotives } from '@core/interfaces/booking';
import { EmailData } from '@core/interfaces/smtp';

import SMTP from 'src/app/utils/smtp';

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
    private smtp: any = new SMTP();

    public apiWpp: string = `https://api.whatsapp.com/send?phone=${3135100760}&text=`;

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

    public times: string[] = ['6:00 pm', '7:00 pm', '8:00 pm', '9:00 pm'];

    constructor(
        private formBuilder: FormBuilder,
        private alertService: AlertService,
        private smtpService: SmtpService
    ) { }

    ngOnInit(): void {
        this.initForm();

        console.log(new Date().toLocaleDateString())
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            date: [new Date().toISOString().split('T')[0], [Validators.required]],
            time: ['', [Validators.required]],
            fullname: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(50)]],
            email: ['', [Validators.required, this.validateMail.bind(this)]],
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

        if (!this.isOther) {
            this.form.get('other_motive')?.setValue('');
        }

        this.updateValidators();
    }

    public verifyDeco(): void {
        this.showMotives = this.form.get('incluye_deco')?.value === 'Si';

        if (!this.showMotives) {
            this.isOther = false;

            this.form.get('motive')?.setValue('');
            this.form.get('other_motive')?.setValue('');
        }

        this.updateValidators();
    }

    public validateMinDate(): void {
        const selected: Date = new Date(this.form.get('date')!.value);
        const now: Date = new Date();

        if (selected < now) {
            this.form.get('date')?.setValue(new Date().toISOString().split('T')[0]);

            this.alertService.alert(`La fecha de la reserva no puede ser menor a la fecha actual`, 'warning', false, 3000);
        }
    }

    public validateMail(control: AbstractControl): ValidationErrors | null {
        const email = control.value;

        if (!email || email === "") return null;

        const patronEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!patronEmail.test(email)) {
            return { emailInvalido: true };
        }

        if (email.length > 254) {
            return { emailDemasiadoLargo: true };
        }

        const partes = email.split('@');

        if (partes[0].length > 64) {
            return { emailLocalPartDemasiadoLargo: true };
        }

        return null;
    }

    private sendMail(body: string): void {
        const dataSend: EmailData = {
            "to": this.form.get('email')!.value.trim(),
            "subject": "Confirmación de reserva",
            "body": body,
        }

        this.smtpService.sendMail(dataSend).subscribe({
            next: (response: any) => {
                console.log(response)
            },
            error: (error: any) => {
                console.error("Error: ", error);
            }
        });
    }
    
    private buildBodyWppMsj(): string {
        let msj: string = '*📋 NUEVA RESERVA* \n\n';
        msj += `📅 *Fecha:* ${new Date(this.form.value.date).toLocaleString().split(',')[0]}\n`;
        msj += `⏱️ *Hora:* ${this.form.value.time}\n\n`;

        msj += `👤 *Nombre:* ${this.form.value.fullname}\n`;
        msj += `🆔 *Documento:* ${this.form.value.document}\n`;
        msj += `👥 *Cantidad de personas:* ${this.form.value.cantidad_personas}\n`;
        msj += `🎊 *Incluye decoración:* ${this.form.value.incluye_deco === 'Si' ? 'Sí ✅' : 'No ❌'}\n`;

        if (this.form.value.incluye_deco === 'Si') {
            msj += `🎯 *Motivo:* `;

            if (this.form.value.motive != '6') {
                msj += this.motives.find((m: any) => m.id == Number(this.form.value.motive))?.name + '\n'
            } else {
                msj += this.form.value.other_motive + '\n'
            }
        }

        if (this.form.value.info_adicional.trim() !== "") {
            msj += `✨ *Info adicional:* ${this.form.value.info_adicional}\n\n`;
        }

        msj += `🚀 *¡Revisar disponibilidad y confirmar cuanto antes!*`;

        return msj;
    }

    private sendWppMsj(msj: string): void {
        window.open(`${this.apiWpp}${encodeURIComponent(msj)}`, '_blank');
    }

    onSubmit(): void {
        // const msjWpp: string = this.buildBodyWppMsj();
        
        const msjEmail: string = this.smtp.buildBodyClientMail(this.motives, this.form);

        // this.sendWppMsj(msjWpp);
        this.sendMail(msjEmail);
    }
}
