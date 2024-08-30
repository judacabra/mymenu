import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ConfigView } from '@core/interfaces/configView';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CommonModule,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})

export default  class LoginComponent {
    public path_logo: string = '../../../public/img/mm-logo.png';
    public username: boolean = false; 
    public noUsername: boolean = false; 
    public password: boolean = false; 
    public noPassword: boolean = false;
    
    public authForm = this._formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
    });
    
    public resetForm = this._formBuilder.group({
        email: ['', Validators.required],
    });
    
    public config: ConfigView = {
        input: 'password',
        title: 'Mostrar contraseña',
        icon: 'fas fa-eye',
        helpText: 'View Password Icon'
    }

    private view: boolean = false;
    
    constructor(private _formBuilder: FormBuilder) { }

    public actionSet(): void {
        if (this.authForm.valid) {
            const dataAuth = this.authForm.getRawValue();
        
            if (dataAuth.username && dataAuth.password) {
                this.setUser(dataAuth.username);
                // this._authService.login(dataAuth.username, dataAuth.password).subscribe({
                // next: (response) => {
                //     this._authService.setCredentials(response?.access_token);
                //     this.router.navigate(['/dashboard']);
                // },
        
                // error: (error: Error) => { }
                // })
            }
        }
    }

    public onUsernameChange(nameValidator: string): void {
        const control = this.authForm.get(nameValidator);

        if(control?.value != ''){
            this.username = true;
            this.noUsername = false;
        } else {
            this.username = false;
            this.noUsername = true;
        }
    }

    public onPasswordChange(nameValidator: string): void {
        const control = this.authForm.get(nameValidator);

        if(control?.value != ''){
            this.password = true;
            this.noPassword = false;
        } else {
            this.password = false;
            this.noPassword = true;
        }
    }

  
    public previewPass(): void {
        this.view = !this.view;

        this.config = {
          input: this.view ? 'password' : 'text',
          title: this.view ? 'Mostrar contraseña' : 'Ocultar contraseña',
          icon: this.view ? 'fas fa-eye' : 'fas fa-eye-slash',
          helpText: this.view ? 'View Password Icon' : 'No view Password Icon',
        }
    }

    private setUser(value: string): void {
        sessionStorage.setItem('username', value);
    }

    public validatePassword(): string {
        const pass = this.authForm.get('password')?.value;
        
        return (pass ?? '');
    }
}
