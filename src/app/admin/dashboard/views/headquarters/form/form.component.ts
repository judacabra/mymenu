import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AlertService } from '@services/alertService/alert.service';
import { environment } from 'src/environments';
import { Router } from '@angular/router';
import { HeadquarterService } from '@services/headquarter/headquarter.service';

@Component({
    selector: 'app-form-headquarters',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
    ],
    templateUrl: './form.component.html',
    styleUrl: './form.component.css'
})

export class FormHeadquarterComponent implements OnInit, OnChanges {
    @Input() headquarter: any = null;
    @Input() actioner: string = "";

    @ViewChild('fileInput') fileInput!: ElementRef;

    public headquarterForm!: FormGroup;
    public selectedFile: File | null = null;
    public imagePreview: string | null = null;

    public path_img: string = './public/img/';
    public path_server: string = environment.imgUrl;

    constructor(
        private formBuilder: FormBuilder,
        private alertService: AlertService,
        private headquarterService: HeadquarterService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.initForm();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['headquarter'] && this.headquarter && this.headquarterForm) {
            this.updateFormWithHeadquarter();
        }
    }

    private initForm(): void {
        this.headquarterForm = this.formBuilder.group({
            id: [{ value: 0, disabled: true }],
            name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            address: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
            description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
            active: [false, [Validators.required]],
        });

        if (this.headquarter) {
            this.updateFormWithHeadquarter();
        }
    }

    private updateFormWithHeadquarter(): void {
        this.headquarterForm.patchValue({
            id: this.headquarter.id || 0,
            name: this.headquarter.name || '',
            address: this.headquarter.address || '',
            description: this.headquarter.description || '',
            active: this.headquarter.active || false,
        });
    }

    public changeImg() {
        this.headquarter.img = '';
        this.imagePreview = null;
    }

    public changeToggleText(): void {
        const currentValue = this.headquarterForm.get('active')?.value;
        
        this.headquarterForm.patchValue({
            active: !currentValue
        });
    }

    public onSubmit(actioner: string): void {
        const dataSend: any = {
            name: this.headquarterForm.get('name')!.value,
            address: this.headquarterForm.get('address')!.value,
            description: this.headquarterForm.get('description')!.value,
            active: this.headquarterForm.get('active')!.value,
        };

        if (actioner == 'Modificar') {
            this.updateHeadquarter(this.headquarterForm.get('id')!.value, dataSend);
        } else {
            this.setHeadquarter(dataSend);
        }
        
        this.updateFormWithHeadquarter();
    }

    private setHeadquarter(data: any): void {
        this.headquarterService.setHeadquarter(data).subscribe({
            next: () => {
                this.router.navigate(['/headquarters'], {
                    queryParams: { created: '1' }
                });
            },
            error: (error: any) => {
                console.error("Error: ", error);

                this.router.navigate(['/headquarters'], {
                    queryParams: { created: '0' }
                });
            }
        });
    }

    private updateHeadquarter(id: number, data: any): void {
        this.headquarterService.updateHeadquarter(id, data).subscribe({
            next: () => {
                this.router.navigate(['/headquarters'], {
                    queryParams: { updated: '1' }
                });
            },
            error: (error: any) => {
                console.error("Error: ", error);

                this.router.navigate(['/headquarters'], {
                    queryParams: { updated: '0' }
                });
            }
        });
    }
}
