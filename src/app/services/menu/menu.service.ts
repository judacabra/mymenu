import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { environment } from '../../../environments';

import { AlertService } from '@services/alertService/alert.service';

import { TypeUrl } from '@core/interfaces/type-url'; 

@Injectable({
    providedIn: 'root'
})

export class MenuService {
    private url = `${environment.apiUrl}`;

    private httpHeaders = new HttpHeaders({
        'Accept': 'application/json'
    });

    constructor(private http: HttpClient, private alertService: AlertService) { }

    public consultTypesByCompany(company_id: number): Observable<TypeUrl[]> {  
        let params = new HttpParams();
        params = params.set('company_id', company_id);

        return this.http.get<TypeUrl[]>(`${this.url}/type/menu`, {params, headers: this.httpHeaders }).pipe(
            catchError((e) => {
                this.alertService.alert(e?.error?.detail, 'error');
                return throwError(() => e);
            })
        );
    }
}