import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';

import { Company } from '@core/interfaces/company';

@Injectable({
    providedIn: 'root'
})

export class CompanyService {
    private url = `${environment.apiUrl}`;

    private httpHeaders = new HttpHeaders({
        'Accept': 'application/json'
    });

    constructor(private http: HttpClient) { }

    public consultCompany(): Observable<Company[]> {    
        return this.http.get<Company[]>(`${this.url}/company`, { headers: this.httpHeaders }).pipe(
            catchError((e) => {
                alert(e?.error?.detail);
                return throwError(() => e);
            })
        );
    }
}
