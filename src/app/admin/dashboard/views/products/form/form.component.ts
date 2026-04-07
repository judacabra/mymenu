import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, Type, ViewChild } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Product } from '@core/interfaces/product';
import { TypeUrl } from '@core/interfaces/type-url';
import { AlertService } from '@services/alertService/alert.service';

@Component({
    selector: 'app-form-products',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
    ],
    templateUrl: './form.component.html',
    styleUrl: './form.component.css'
})

export class FormProductComponent implements OnInit, OnChanges {
    @Input() product: any = null;
    @ViewChild('fileInput') fileInput!: ElementRef;

    public productForm!: FormGroup;
    public selectedFile: File | null = null;
    public imagePreview: string | null = null;

    public isChecked: boolean = false;

    public path_img: string = './public/img/';

    public types: TypeUrl[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private alertService: AlertService,
    ) {}

    ngOnInit(): void {
        this.initForm();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['product'] && this.product && this.productForm) {
            this.updateFormWithProduct();
        }
    }

    private initForm(): void {
        this.productForm = this.formBuilder.group({
            id: [{ value: 0, disabled: true }], // ID normalmente no editable
            name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
            id_type: [0, [Validators.required, Validators.min(1)]],
            price: [0, [Validators.required, Validators.min(0.01)]],
            stock: [0, [Validators.required, Validators.min(0)]],
            recommended: ['', [Validators.required]],
            id_company: [0, [Validators.required]]
        });

        if (this.product) {
            this.updateFormWithProduct();
        }
    }

    private updateFormWithProduct(): void {
        this.productForm.patchValue({
            id: this.product.id || 0,
            name: this.product.name || '',
            description: this.product.description || '',
            id_type: this.product.id_type || 0,
            price: this.product.price || 0,
            stock: this.product.stock || 0,
            recommended: this.product.recommended || '',
            id_company: this.product.id_company || 0
        });

        if (this.product.img) {
            this.imagePreview = this.path_img + this.product.img;
        }
    }

    public changeImg() {
        this.product.img = '';
        this.imagePreview = null;
    }

    public changeToggleText(): void {
        const currentValue = this.productForm.get('recommended')?.value;
        this.productForm.patchValue({
            recommended: currentValue === 'SI' ? 'NO' : 'SI'
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

    onSubmit(): void {
        if (this.productForm.invalid) {
            this.markFormGroupTouched(this.productForm);
            this.alertService.alert("Por favor complete todos los campos requeridos correctamente", "error");
            return;
        }

        const formData = new FormData();
        const formValues = this.productForm.getRawValue(); // getRawValue incluye campos disabled

        // Agregar todos los campos del formulario
        Object.keys(formValues).forEach(key => {
            if (formValues[key] !== null && formValues[key] !== undefined) {
                formData.append(key, formValues[key].toString());
            }
        });

        // Agregar la imagen si se seleccionó una nueva
        if (this.selectedFile) {
            formData.append('img', this.selectedFile);
        }

        // Aquí llamas a tu servicio para guardar
        // this.productService.saveProduct(formData).subscribe(...)
    }

    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.values(formGroup.controls).forEach(control => {
            control.markAsTouched();
            if (control instanceof FormGroup) {
                this.markFormGroupTouched(control);
            }
        });
    }

    get name() { return this.productForm.get('name'); }
    get description() { return this.productForm.get('description'); }
    get id_type() { return this.productForm.get('id_type'); }
    get price() { return this.productForm.get('price'); }
    get stock() { return this.productForm.get('stock'); }
    get recommended() { return this.productForm.get('recommended'); }
}
