import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { environment } from '../../../environments';

import { AlertService } from '@services/alertService/alert.service';

import { Profile } from '@core/interfaces/profile';

@Injectable({
    providedIn: 'root'
})

export class ProfileService {
    private url = `${environment.apiUrl}`;

    private httpHeaders = new HttpHeaders({
        'Accept': 'application/json'
    });

    constructor(private http: HttpClient, private alertService: AlertService) { }

    public consultProfiles(): Observable<Profile[]> {    
        return this.http.get<Profile[]>(`${this.url}/profiles`, { headers: this.httpHeaders }).pipe(
            catchError((e) => {
                this.alertService.alert(e?.error?.detail, 'error');
                return throwError(() => e);
            })
        );
    }
}
