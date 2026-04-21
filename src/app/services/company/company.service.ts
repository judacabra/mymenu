import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { environment } from '../../../environments';

import { AlertService } from '@services/alertService/alert.service';

import { Company } from '@core/interfaces/company';
import { CompaniesInfo } from '@core/interfaces/companiesInfo';

@Injectable({
    providedIn: 'root'
})

export class CompanyService {
    private url = `${environment.apiUrl}`;

    private httpHeaders = new HttpHeaders({
        'Accept': 'application/json',
    });

    constructor(
        private http: HttpClient, 
        private alertService: AlertService
    ) {}

    public getCompanyByParam(id?: number, name?: string): Observable<Company> {    
        let params = new HttpParams();

        if (id) params = params.set('id', id); 

        if (name) params = params.set('name', name); 

        return this.http.get<Company>(`${this.url}/company_by_param`, { params, headers: this.httpHeaders }).pipe(
            catchError((e) => {
                this.alertService.alert(e?.error?.detail, 'error');
                return throwError(() => e);
            })
        );
    }

    public getCompaniesInfo(): Observable<CompaniesInfo> {    
        return this.http.get<CompaniesInfo>(`${this.url}/companies_info`, { headers: this.httpHeaders }).pipe(
            catchError((e) => {
                this.alertService.alert(e?.error?.detail, 'error');
                return throwError(() => e);
            })
        );
    }

    public consultCompanies(): Observable<Company[]> {    
        return this.http.get<Company[]>(`${this.url}/companies`, { headers: this.httpHeaders }).pipe(
            catchError((e) => {
                this.alertService.alert(e?.error?.detail, 'error');
                return throwError(() => e);
            })
        );
    }
}
