import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TypeUrl } from '@core/interfaces/type-url';

import { AlertService } from '@services/alertService/alert.service';
import { ProductService } from '@services/product/product.service';
import { environment } from 'src/environments';

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
    @Input() actioner: string = "";

    @ViewChild('fileInput') fileInput!: ElementRef;

    public productForm!: FormGroup;
    public selectedFile: File | null = null;
    public imagePreview: string | null = null;

    public isChecked: boolean = false;

    public path_img: string = './public/img/';
    public path_server: string = environment.imgUrl;

    public types: TypeUrl[] = [
        { id: 5, name: "Entradas", url: "" },
        { id: 6, name: "Fuertes", url: "" },
        { id: 7, name: "Bebidas", url: "" },
    ];

    constructor(
        private formBuilder: FormBuilder,
        private alertService: AlertService,
        private productService: ProductService,
    ) { }

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
            id: [{ value: 0, disabled: true }],
            name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
            id_type: [0, [Validators.required, Validators.min(1)]],
            price: [0, [Validators.required, Validators.min(0.01)]],
            stock: [0, [Validators.required, Validators.min(0)]],
            recommended: ['NO', [Validators.required]],
            id_company: [1, [Validators.required]]
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
            recommended: this.product.recommended || 'NO',
            id_company: this.product.id_company || 1
        });

        this.imagePreview = this.product.img ? this.path_img + this.product.img : '';
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

    public onSubmit(actioner: string): void {
        const dataSend = new FormData();
        
        const productObject = {
            name: this.productForm.get('name')!.value,
            description: this.productForm.get('description')!.value,
            id_type: this.productForm.get('id_type')!.value,
            recommended: this.productForm.get('recommended')!.value,
            price: this.productForm.get('price')!.value,
            stock: this.productForm.get('stock')!.value,
            id_company: this.productForm.get('id_company')!.value
        };

        dataSend.append("product_data", JSON.stringify(productObject));

        if (this.selectedFile) {
            dataSend.append("img", this.selectedFile);
        }

        if (actioner == 'Modificar') {
            this.updateProduct(this.productForm.get('id')!.value, dataSend);
        } else {
            this.setProduct(dataSend);
        }
    }

    private setProduct(data: any): void {
        this.productService.setProduct(data).subscribe({
            next: () => {
                this.alertService.alert(`Producto creado exitosamente`, 'success', false);
            },
            error: (error: any) => {
                console.error("Error: ", error);
            }
        });
    }

    private updateProduct(id: number, data: any): void {
        this.productService.updateProduct(id, data).subscribe({
            next: () => {
                this.alertService.alert(`Producto actualizado exitosamente`, 'success', false);
            },
            error: (error: any) => {
                console.error("Error: ", error);
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

    get name() { return this.productForm.get('name'); }
    get description() { return this.productForm.get('description'); }
    get id_type() { return this.productForm.get('id_type'); }
    get price() { return this.productForm.get('price'); }
    get stock() { return this.productForm.get('stock'); }
    get recommended() { return this.productForm.get('recommended'); }
}
