import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TypeUrl } from '@core/interfaces/type-url';

import { AlertService } from '@services/alertService/alert.service';
import { CompanyService } from '@services/company/company.service';
import { environment } from 'src/environments';
import { Router } from '@angular/router';
import { Company } from '@core/interfaces/company';

@Component({
    selector: 'app-form-companies',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
    ],
    templateUrl: './form.component.html',
    styleUrl: './form.component.css'
})

export class FormCompanyComponent implements OnInit, OnChanges {
    @Input() company: any = null;
    @Input() actioner: string = "";

    @ViewChild('fileInput') fileInput!: ElementRef;

    public companyForm!: FormGroup;
    public selectedFile: File | null = null;
    public imagePreview: string | null = null;

    public path_img: string = './public/img/';
    public path_server: string = environment.imgUrl;

    constructor(
        private formBuilder: FormBuilder,
        private alertService: AlertService,
        private companyService: CompanyService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.initForm();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['company'] && this.company && this.companyForm) {
            this.updateFormWithCompany();
        }
    }

    private initForm(): void {
        this.companyForm = this.formBuilder.group({
            id: [{ value: 0, disabled: true }],
            name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            nit: [0, [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
            description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
            active: [false, [Validators.required]],
        });

        if (this.company) {
            this.updateFormWithCompany();
        }
    }

    private updateFormWithCompany(): void {
        this.companyForm.patchValue({
            id: this.company.id || 0,
            name: this.company.name || '',
            nit: this.company.nit || 0,
            description: this.company.description || '',
            active: this.company.active || false,
        });

        this.imagePreview = this.company.img ? this.path_img + this.company.img : '';
    }

    public changeImg() {
        this.company.img = '';
        this.imagePreview = null;
    }

    public changeToggleText(): void {
        const currentValue = this.companyForm.get('active')?.value;
        
        this.companyForm.patchValue({
            active: !currentValue
        });
    }

    public verifyIMG(event: Event): void {
        const input_file = event.target as HTMLInputElement;

        if (input_file.files && input_file.files.length > 0) {
            const file: File = input_file.files[0];

            if (file) {
                const allowedTypes = ['image/svg+xml', 'image/x-icon', 'image/jpeg', 'image/png', 'image/jpg'];
                const maxSize = 2 * 1024 * 1024; // 2MB

                if (!allowedTypes.includes(file.type)) {
                    this.alertService.alert("Tipo de imagen no válido. Solo se permiten SVG, ICO, JPEG, PNG", "error");
                    this.clearFileInput();
                    return;
                }

                if (file.size > maxSize) {
                    this.alertService.alert("La imagen es muy pesada. Máximo 2MB", "error");
                    this.clearFileInput();
                    return;
                }

                this.selectedFile = file;

                const reader = new FileReader();
                reader.onload = (e: any) => {
                    this.imagePreview = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        }
    }

    private clearFileInput(): void {
        this.selectedFile = null;
        this.imagePreview = null;

        if (this.fileInput) {
            this.fileInput.nativeElement.value = '';
        }
    }

    public onSubmit(actioner: string): void {
        const dataSend: FormData = new FormData();
        
        const companyObject: Company = {
            name: this.companyForm.get('name')!.value,
            nit: this.companyForm.get('nit')!.value,
            description: this.companyForm.get('description')!.value,
            active: this.companyForm.get('active')!.value,
        };

        dataSend.append("company_data", JSON.stringify(companyObject));

        if (this.selectedFile) dataSend.append("img", this.selectedFile);

        if (actioner == 'Modificar') {
            this.updateCompany(this.companyForm.get('id')!.value, dataSend);
        } else {
            this.setCompany(dataSend);
        }
        
        this.updateFormWithCompany();
    }

    private setCompany(data: any): void {
        this.companyService.setCompany(data).subscribe({
            next: () => {
                this.router.navigate(['/companies'], {
                    queryParams: { created: '1' }
                });
            },
            error: (error: any) => {
                console.error("Error: ", error);

                this.router.navigate(['/companies'], {
                    queryParams: { created: '0' }
                });
            }
        });
    }

    private updateCompany(id: number, data: any): void {
        this.companyService.updateCompany(id, data).subscribe({
            next: () => {
                this.router.navigate(['/companies'], {
                    queryParams: { updated: '1' }
                });
            },
            error: (error: any) => {
                console.error("Error: ", error);

                this.router.navigate(['/companies'], {
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
