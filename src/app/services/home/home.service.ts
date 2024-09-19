import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';

import { AlertService } from '@services/alertService/alert.service';

import { TypeUrl } from '@core/interfaces/type-url'; 

@Injectable({
    providedIn: 'root'
})

export class HomeService {
    private url = `${environment.apiUrl}`;

    private httpHeaders = new HttpHeaders({
        'Accept': 'application/json'
    });

    constructor(private http: HttpClient, private alertService: AlertService) { }

    public consultTypes(): Observable<TypeUrl[]> {    
        return this.http.get<TypeUrl[]>(`${this.url}/type/home`, { headers: this.httpHeaders }).pipe(
            catchError((e) => {
                this.alertService.alert(e?.error?.detail, 'error');
                return throwError(() => e);
            })
        );
    }
}
