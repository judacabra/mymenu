import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AlertService } from '@services/alertService/alert.service';
import { UserService } from '@services/user/user.service';
import { environment } from 'src/environments';
import { Router } from '@angular/router';
import { User } from '@core/interfaces/user';
import { Profile } from '@core/interfaces/profile';
import { Headquarter } from '@core/interfaces/headquarter';

@Component({
    selector: 'app-form-users',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
    ],
    templateUrl: './form.component.html',
    styleUrl: './form.component.css'
})

export class FormUserComponent implements OnInit, OnChanges {
    @Input() user: any = null;
    @Input() actioner: string = "";
    @Input() headquarters: Headquarter[] = [];
    @Input() profiles: Profile[] = [];

    public userForm!: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private alertService: AlertService,
        private userService: UserService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.initForm();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['user'] && this.user && this.userForm) {
            this.updateFormWithUser();
        }
    }

    private initForm(): void {
        this.userForm = this.formBuilder.group({
            id: [{ value: 0, disabled: true }],
            name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
            username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
            email: ['', [Validators.required, this.validateMail.bind(this)]],
            id_profile: [0, [Validators.required]],
            id_headquarter: [0, [Validators.required]],
            active: [false, [Validators.required]],
        });
    }

    private updateFormWithUser(): void {
        this.userForm.patchValue({
            id: this.user.id || 0,
            name: this.user.name || '',
            username: this.user.username || '',
            email: this.user.email || '',
            id_profile: this.user.profile.id || 0,
            id_headquarter: this.user.headquarter.id || 0,
            active: this.user.active || false,
        });
    }

    public createUsername(): void {
        const name: string = this.userForm.get('name')!.value;

        const parts = name.trim().toLowerCase().split(/\s+/);

        let username: string = '';

        if (parts.length === 1) {
            username = parts[0];
            return;
        }

        const initFirstName: string= parts[0].charAt(0);
        const secondPart: string = (parts.length === 2) ? parts[1] : parts[2];

        username = initFirstName + secondPart;

        this.userForm.get('username')!.setValue(username);
    }

    public changeToggleText(): void {
        const currentValue = this.userForm.get('active')?.value;

        this.userForm.patchValue({
            active: !currentValue
        });
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

    public onSubmit(actioner: string): void {
        const dataSend: User = {
            name: this.userForm.get('name')!.value,
            email: this.userForm.get('email')!.value,
            username: this.userForm.get('username')!.value,
            active: this.userForm.get('active')!.value,
            id_profile: this.userForm.get('id_profile')!.value,
            id_headquarter: this.userForm.get('id_headquarter')!.value,
        };
        
        if (actioner == 'Modificar') {
            this.updateUser(this.userForm.get('id')!.value, dataSend);
        } else {
            this.setUser(dataSend);
        }

        this.updateFormWithUser();
    }

    private setUser(data: any): void {
        this.userService.setUser(data).subscribe({
            next: () => {
                this.router.navigate(['/users'], {
                    queryParams: { created: '1' }
                });
            },
            error: (error: any) => {
                console.error("Error: ", error);

                this.router.navigate(['/users'], {
                    queryParams: { created: '0' }
                });
            }
        });
    }

    private updateUser(id: number, data: any): void {
        this.userService.updateUser(id, data).subscribe({
            next: () => {
                this.router.navigate(['/users'], {
                    queryParams: { updated: '1' }
                });
            },
            error: (error: any) => {
                console.error("Error: ", error);

                this.router.navigate(['/users'], {
                    queryParams: { updated: '0' }
                });
            }
        });
    }

    public filterLetters(event: KeyboardEvent): boolean {
        const key = event.key;
        
        const keysPermited = ['Backspace', 'Space', 'Delete', 'Enter', 'ArrowLeft', 'ArrowRight', ' '];
        
        if (keysPermited.includes(key)) {
            return true;
        }
        
        const regexletters = /^[a-zA-ZáéíóúñÁÉÍÓÚÑ]$/;

        return regexletters.test(key);
    }

    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.values(formGroup.controls).forEach(control => {
            control.markAsTouched();
            if (control instanceof FormGroup) {
                this.markFormGroupTouched(control);
            }
        });
    }
}
