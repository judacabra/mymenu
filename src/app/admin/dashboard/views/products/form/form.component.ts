import { CommonModule } from '@angular/common';
import { Component, Input, Type } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
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

export class FormProductComponent {
    @Input() product: Product = {
        id: 0,
        name: '',
        id_company: 0,
        description: '',
        id_type: 0,
        recommended: 'NO',
        img: '',
        price: 0,
        stock: 0,
    };
    
    public isChecked: boolean = false;


    public types: TypeUrl[] = [];

    public productForm = this.formBuilder.group({
        name: ['', [Validators.required]],
        id_company: [0, [Validators.required]],
        description: ['', [Validators.required, Validators.maxLength(50)]],
        id_type: [0, [Validators.required]],
        recommended: ['', [Validators.maxLength(2)]],
        img: ['', [Validators.required, Validators.maxLength(50)]],
        price: [0, [Validators.required]],
        stock: [0, [Validators.required]],
    });

    constructor(private formBuilder: FormBuilder, private alertService: AlertService) {}

    public changeToggleText(): void {
        if (this.product.recommended == 'SI'){
            this.product.recommended = 'NO';
        } else {
            this.product.recommended = 'SI';
        }
    }

    public verifyIMG(event: Event): void {
        const input_file = event.target as HTMLInputElement;

        if (input_file.files && input_file.files.length > 0) {
            const file: File = input_file.files[0];

            if (file) {
                const allowedTypes = ['image/svg', 'image/x-icon', 'image/jpeg', 'image/png'];
                const maxSize = 2 * 1024 * 1024;
                
                if (!allowedTypes.includes(file.type)) {
                    this.alertService.alert("Tipo de imagen no valido.", "error");
                    this.productForm.get('img')?.setValue('');
                } else if (file.size > maxSize) {
                    this.alertService.alert("La imagen es muy pesada.", "error");
                    this.productForm.get('img')?.setValue('');
                }
            }
        }
    }
}
