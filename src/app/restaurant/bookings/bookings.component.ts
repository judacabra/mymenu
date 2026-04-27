import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingMotives } from '@core/interfaces/booking-motives';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AlertService } from '@services/alertService/alert.service';
import { SmtpService } from '@services/smtp/smtp.service';
import { EmailData } from '@core/interfaces/smtp';

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
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            date: ['', [Validators.required]],
            time: ['', [Validators.required]],
            fullname: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(50)]],
            email: ['', [Validators.required, this.validarEmail.bind(this)]],
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
                msj += this.motives.find(m => m.id == Number(this.form.value.motive))?.name + '\n'
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
    
    private buildBodyMail(): string {
        const colorCompany: string = '#523D27';

        let body: string = 
        `<!DOCTYPE html>
        <html lang="es-CO">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email</title>

            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">

            <style>
                .container { width: 70vw !important; padding-left: 3rem !important; padding-right: 3rem !important; }
                .bg-gray { background: #eee; }
                .rounded-50 { border-radius: 50px; }
                .w-40 { width: 40%; }
                .w-60 { width: 60%; }
                .w-15-vw { width: 15vw; }
                .bg-company { background: ${colorCompany}; }
                .br-company { border: solid ${colorCompany}; border-top: none; }
                .br-end-company { border: solid ${colorCompany}; border-bottom: none; border-top: none; border-left: none; }
                .rounded-top-40 { border-radius: 40px 40px 0 0; }
                .rounded-bottom-40 { border-radius: 0 0 40px 40px; }
            </style>
        </head>

        <body>
            <div class="container d-flex justify-content-center align-item-center bg-company rounded-top-40 mt-3 py-4">
                <img id="company_img" alt="image-company" class="w-50" />
            </div>
            <div class="container py-5 br-company rounded-bottom-40 mb-3">                
                <h1> Tu reserva </h1>
                <h3 class="mb-5"> Tu reserva se ha completado satisfactoriamente.</h3>

                <div class="d-flex bg-gray rounded-50 p-3 mt-3 mb-4 br-company border-bottom-0">
                    <div id="icon" class="d-flex justify-content-center align-items-center w-40 br-end-company">
                        <img id="check_img" alt="check-green" class="w-15-vw" />
                    </div>

                    <div id="info" class="d-flex flex-column w-60 px-5">
                        <h4> Gracias por reservar </h4> 
                        <br>

                        <p class="m-0 p-0">🗓️ <b>Fecha:</b> ${new Date(this.form.value.date).toLocaleString().split(',')[0]}</p>
                        <p>⏱️ <b>Hora:</b> ${this.form.value.time}</p>

                        <p class="m-0 p-0">👤 <b>Nombre:</b> ${this.form.value.fullname}</p>
                        <p class="m-0 p-0">🆔 <b>Documento:</b> ${this.form.value.document}</p>
                        <p class="m-0 p-0">👥 <b>Cantidad de personas:</b> ${this.form.value.cantidad_personas}</p>
                        <p class="m-0 p-0">🎊 <b>Incluye decoración:</b> ${this.form.value.incluye_deco === 'Si' ? 'Sí ✅' : 'No ❌'}</p>`;

                    if (this.form.value.incluye_deco === 'Si') {
                        body += `<p class="m-0 p-0"> 🎯 <b>Motivo:</b> `;

                        if (this.form.value.motive != '6') {
                            body += this.motives.find(m => m.id == Number(this.form.value.motive))?.name 
                        } else {
                            body += this.form.value.other_motive
                        }

                        body += '</p>'
                    }

                    if (this.form.value.info_adicional.trim() !== "") {
                        body += `<p class="m-0 p-0"> ✨ <b>Información adicional:</b> ${this.form.value.info_adicional}</p>`;
                    }

        body +=     `<br />
                    </div>
                </div>

                <div id="buttons" class="d-flex justify-content-center align-items-center">
                    <button type="button" class="btn btn-primary px-3" id="newBooking"> Nueva reserva </button>
                </div>
            </div>
        </body>

        <script>
            // set company img
            const company_img = 'http://192.168.1.119:8000/uploads/company/elcorreo.png';
            document.getElementById("company_img").setAttribute('src', company_img);

            // set check img
            const check_img_path = 'http://192.168.1.119:8000/uploads/smtp/check-green.png';
            document.getElementById("check_img").setAttribute('src', check_img_path);

            // go to new booking
            function goToNewBooking() {
                window.open('http://localhost:4200/mymenu/bookings', '_blank');
            }

            document.getElementById("newBooking").addEventListener('click', goToNewBooking);
        </script>

        </html>`;

        return body;
    }

    public validateMinDate(): void {
        const selected: Date = new Date(this.form.get('date')!.value);
        const now: Date = new Date();

        if (selected < now) {
            this.form.get('date')?.setValue('');

            this.alertService.alert(`La fecha de la reserva no puede ser menor a la fecha actual`, 'warning', false, 3000);
        }
    }

    public validarEmail(control: AbstractControl): ValidationErrors | null {
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
            "subject": "Nueva reserva",
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

    private sendWppMsj(msj: string): void {
        window.open(`${this.apiWpp}${encodeURIComponent(msj)}`, '_blank');
    }

    onSubmit(): void {
        // const msjWpp: string = this.buildBodyWppMsj();
        const msjEmail: string = this.buildBodyMail();

        // this.sendWppMsj(msjWpp);
        this.sendMail(msjEmail);
    }
}
