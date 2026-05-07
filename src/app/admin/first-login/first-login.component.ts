import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ConfigView } from '@core/interfaces/configView';
import { UserService } from '@services/user/user.service';
import { AuthService } from '@services/authService/auth.service';
import { AlertService } from '@services/alertService/alert.service';
import { retry, Subscription } from 'rxjs';

@Component({
    selector: 'app-first-login',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CommonModule,
    ],
    templateUrl: './first-login.component.html',
    styleUrl: './first-login.component.css'
})

export default class FirstLoginComponent implements OnInit, OnDestroy {
    public path_logo: string = './public/img/logo.png';
    
    public newPassword: boolean = false;
    public noNewPassword: boolean = false;
    
    public confirmPassword: boolean = false;
    public noConfirmPassword: boolean = false;

    public form = this.formBuilder.group({
        id: [0, Validators.required],
        newPassword: ['', Validators.required],
        confirmPassword: ['', Validators.required],
    });

    public configNew: ConfigView = {
        input: 'password',
        title: 'Mostrar nueva contraseña',
        icon: 'fas fa-eye',
        helpText: 'View password icon'
    }

    public configConfirm: ConfigView = {
        input: 'password',
        title: 'Mostrar contraseña',
        icon: 'fas fa-eye',
        helpText: 'View password icon'
    }

    private querySub: Subscription | undefined;

    private newView: boolean = false;
    private confirmView: boolean = false;

    constructor(
        private formBuilder: FormBuilder, 
        private authService: AuthService, 
        private userService: UserService, 
        private alertService: AlertService, 
        private route: ActivatedRoute,
        private router: Router,
    ) {}

    ngOnInit() {
        this.actionValidator();
    }

    public actionSet(): void {
        if (this.form.valid) {
            const dataAuth = this.form.getRawValue();

            if (!dataAuth.id) return;

            if (!dataAuth.newPassword || dataAuth.newPassword === "") {
                this.alertService.alert(`Por favor ingresa una contraseña.`, 'error');
                return;
            }

            if (dataAuth.newPassword !== dataAuth.confirmPassword) {
                this.alertService.alert(`Las contraseñas ingresadas no coinciden.`, 'error');
                return;
            }

            const dataSend: any = {
                newPass: dataAuth.newPassword,
                confirmPass: dataAuth.confirmPassword,
            };

            this.userService.changePassword(dataAuth.id, dataSend).subscribe({
                next: (response: any) => {
                    this.authService.setCredentials(response.access_token);
                    
                    this.router.navigate(['/dashboard'], {
                        queryParams: { changedPassword : 1 }, 
                    });
                },
                error: (error: any) => {
                    this.alertService.alert(`Error al actualizar la contraseña.`, 'error');
                    console.error("Error: ", error)
                }
            })
        }
    }

    public onNewPasswordChange(nameValidator: string): void {
        const control = this.form.get(nameValidator);

        if (control?.value != '') {
            this.newPassword = true;
            this.noNewPassword = false;
        } else {
            this.newPassword = false;
            this.noNewPassword = true;
        }
    }

    public onConfirmPasswordChange(nameValidator: string): void {
        const control = this.form.get(nameValidator);

        if (control?.value != '') {
            this.confirmPassword = true;
            this.noConfirmPassword = false;
        } else {
            this.confirmPassword = false;
            this.noConfirmPassword = true;
        }
    }

    public previewNewPass(): void {
        this.newView = !this.newView;

        this.configNew = {
            input: this.newView ? 'password' : 'text',
            title: this.newView ? 'Mostrar nueva contraseña' : 'Ocultar nueva contraseña',
            icon: this.newView ? 'fas fa-eye' : 'fas fa-eye-slash',
            helpText: this.newView ? 'View Password Icon' : 'No view Password Icon',
        }
    }

    public previewConfirmPass(): void {
        this.confirmView = !this.confirmView;

        this.configConfirm = {
            input: this.confirmView ? 'password' : 'text',
            title: this.confirmView ? 'Mostrar contraseña' : 'Ocultar contraseña',
            icon: this.confirmView ? 'fas fa-eye' : 'fas fa-eye-slash',
            helpText: this.confirmView ? 'View Password Icon' : 'No view Password Icon',
        }
    }

    public validateNewPassword(): string {
        const pass = this.form.get('newPassword')?.value;

        return (pass ?? '');
    }

    public validateConfirmPassword(): string {
        const pass = this.form.get('confirmPassword')?.value;

        return (pass ?? '');
    }

    private actionValidator(): void {
        this.querySub = this.route.queryParams.subscribe((params) => {
            const id = String(params['id'] || '').trim();

            if (!id || id === '') return;

            this.form.get('id')!.setValue(Number(id));

            this.router.navigate([], {
                relativeTo: this.route,
                replaceUrl: true,
                queryParams: {},
            });
        });
    }

    ngOnDestroy() {
        if (this.querySub) {
            this.querySub.unsubscribe();
        }
    }
}
