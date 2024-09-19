import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';

import { AlertService } from '@services/alertService/alert.service';

import { TypeUrl } from '@core/interfaces/type-url'; 
import { Product } from '@core/interfaces/product';

@Injectable({
    providedIn: 'root'
})

export class ListService {
    private url = `${environment.apiUrl}`;

    private httpHeaders = new HttpHeaders({
        'Accept': 'application/json'
    });

    constructor(private http: HttpClient, private alertService: AlertService) { }

    public typeRecommended(): Observable<TypeUrl[]> {    
        return this.http.get<TypeUrl[]>(`${this.url}/type/recommended`, { headers: this.httpHeaders }).pipe(
            catchError((e) => {
                this.alertService.alert(e?.error?.detail, 'error');
                return throwError(() => e);
            })
        );
    }

    public consultProducts(): Observable<Product[]> {    
        return this.http.get<Product[]>(`${this.url}/products`, { headers: this.httpHeaders }).pipe(
            catchError((e) => {
                this.alertService.alert(e?.error?.detail, 'error');
                return throwError(() => e);
            })
        );
    }
}
