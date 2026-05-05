import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, catchError, throwError } from 'rxjs';

import { environment } from '../../../environments';

import { AlertService } from '@services/alertService/alert.service';

import { Auth } from '@core/interfaces/auth';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private url = `${environment.apiUrl}`;

    private httpHeaders = new HttpHeaders({
        'Accept': 'application/json'
    });

    constructor(
        private http: HttpClient, 
        private router: Router, 
        private alertService: AlertService
    ) {}

    public login(username: string, pass: string): Observable<Auth> {
        let params = new URLSearchParams();
        
        params.set('username', username);
        params.set('password', pass);

        const transfer = this._getHttpTransfer();

        return this.http.post<Auth>(`${this.url}/login`, params.toString(), { headers: transfer }).pipe(
            catchError((e) => {
                this.alertService.alert(e?.error?.detail, 'error');
                return throwError(() => e);
            })
        );
    }

    private _getHttpTransfer(): HttpHeaders {
        const httpHeaders = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        return httpHeaders;
    }

    public logout(): Observable<any> {
        return this.http.post<any>(`${this.url}/`, null, { headers: this.httpHeaders }).pipe(
            catchError((e) => {
                this.alertService.alert(e?.error?.detail, 'error');
                return throwError(() => e);
            })
        )
    }

    public setCredentials(token: string): void {
        const payload = JSON.parse(window.atob(token.split('.')[1]));
        
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user_id', payload.sub);
    }

    public getCredentials(): string | null {
        return sessionStorage.getItem('token') ?? null;
    }

    public isTokenExpired(): boolean {
        const token = this.getCredentials() ? this.getCredentials() : null;
        if (token && token.length > 0) {
            const payload = JSON.parse(window.atob(token.split('.')[1]));
            const date = new Date(0);
            date.setUTCSeconds(payload.exp);

            return new Date() < date;
        }

        return false;
    }

    public isNotAuthorized(): void {
        this.endSession();
        this.router.navigate(['/admin']);

    }

    private endSession(): void {
        sessionStorage.clear();
        localStorage.clear();
    }
}
