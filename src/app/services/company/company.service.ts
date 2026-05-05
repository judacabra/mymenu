import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { environment } from '../../../environments';

import { AlertService } from '@services/alertService/alert.service';

import { Company, CompaniesInfo } from '@core/interfaces/company';

@Injectable({
    providedIn: 'root'
})

export class CompanyService {
    private url: string = `${environment.apiUrl}`;

    private httpHeaders: HttpHeaders = new HttpHeaders({
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

    public setCompany(data: any): Observable<Company> {    
        return this.http.post<Company>(`${this.url}/company`, data, { headers: this.httpHeaders }).pipe(
            catchError((e) => {
                this.alertService.alert(e?.error?.detail, 'error');
                return throwError(() => e);
            })
        );
    }

    public updateCompany(id: number, data: any): Observable<Company> {    
        return this.http.put<Company>(`${this.url}/company/${id}`, data, { headers: this.httpHeaders }).pipe(
            catchError((e) => {
                this.alertService.alert(e?.error?.detail, 'error');
                return throwError(() => e);
            })
        );
    }
}
