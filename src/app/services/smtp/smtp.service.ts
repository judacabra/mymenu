import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { environment } from '../../../environments';

import { AlertService } from '@services/alertService/alert.service';

import { Profile } from '@core/interfaces/profile';
import { EmailData } from '@core/interfaces/smtp';

@Injectable({
    providedIn: 'root'
})

export class SmtpService {
    private url = `${environment.apiUrl}`;

    private httpHeaders = new HttpHeaders({
        'Accept': 'application/json'
    });

    constructor(private http: HttpClient, private alertService: AlertService) { }

    public sendMail(data: EmailData): Observable<Profile[]> {
        return this.http.post<any>(`${this.url}/send-mail`, data,{ headers: this.httpHeaders }).pipe(
            catchError((e) => {
                this.alertService.alert(e?.error?.detail, 'error');
                return throwError(() => e);
            })
        );
    }
}
