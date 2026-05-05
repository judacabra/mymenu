import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TypeUrl } from '@core/interfaces/type-url';

import { AlertService } from '@services/alertService/alert.service';
import { ProfileService } from '@services/profile/profile.service';
import { environment } from 'src/environments';
import { Router } from '@angular/router';
import { Profile } from '@core/interfaces/profile';

@Component({
    selector: 'app-form-profiles',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
    ],
    templateUrl: './form.component.html',
    styleUrl: './form.component.css'
})

export class FormProfileComponent implements OnInit, OnChanges {
    @Input() profile: any = null;
    @Input() actioner: string = "";

    public profileForm!: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private profileService: ProfileService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.initForm();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['profile'] && this.profile && this.profileForm) {
            this.updateFormWithProfile();
        }
    }

    private initForm(): void {
        this.profileForm = this.formBuilder.group({
            id: [{ value: 0, disabled: true }],
            name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
        });
    }

    private updateFormWithProfile(): void {
        this.profileForm.patchValue({
            id: this.profile.id || 0,
            name: this.profile.name || '',
            description: this.profile.description || '',
        });
    }

    public onSubmit(actioner: string): void {
        const dataSend: Profile = {
            name: this.profileForm.get('name')!.value,
            description: this.profileForm.get('description')!.value,
        };

        if (actioner == 'Modificar') {
            this.updateProfile(this.profileForm.get('id')!.value, dataSend);
        } else {
            this.setProfile(dataSend);
        }

        this.updateFormWithProfile();
    }

    private setProfile(data: any): void {
        this.profileService.setProfile(data).subscribe({
            next: () => {
                this.router.navigate(['/profiles'], {
                    queryParams: { created: '1' }
                });
            },
            error: (error: any) => {
                console.error("Error: ", error);

                this.router.navigate(['/profiles'], {
                    queryParams: { created: '0' }
                });
            }
        });
    }

    private updateProfile(id: number, data: any): void {
        this.profileService.updateProfile(id, data).subscribe({
            next: () => {
                this.router.navigate(['/profiles'], {
                    queryParams: { updated: '1' }
                });
            },
            error: (error: any) => {
                console.error("Error: ", error);

                this.router.navigate(['/profiles'], {
                    queryParams: { updated: '0' }
                });
            }
        });
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
