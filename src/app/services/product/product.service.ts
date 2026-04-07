import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';

import { AlertService } from '@services/alertService/alert.service';

import { Product } from '@core/interfaces/product';
import { TypeUrl } from '@core/interfaces/type-url';

@Injectable({
    providedIn: 'root'
})

export class ProductService {
    private url = `${environment.apiUrl}`;

    private httpHeaders = new HttpHeaders({
        'Accept': 'application/json'
    });

    constructor(private http: HttpClient, private alertService: AlertService) { }

    public consultProductById(id: number): Observable<Product> {  
        let params = new HttpParams();
        params = params.set('id', id);
        
        return this.http.get<Product>(`${this.url}/product_by_id`, { params, headers: this.httpHeaders }).pipe(
            catchError((e) => {
                this.alertService.alert(e?.error?.detail, 'error');
                return throwError(() => e);
            })
        );
    }

    public typeRecommendedByCompany(company_id: number): Observable<TypeUrl[]> {  
        let params = new HttpParams;
        params = params.set('company_id', company_id);
        
        return this.http.get<TypeUrl[]>(`${this.url}/type/recommended`, { params, headers: this.httpHeaders }).pipe(
            catchError((e) => {
                this.alertService.alert(e?.error?.detail, 'error');
                return throwError(() => e);
            })
        );
    }

    public consultProductsByUser(user_id: number): Observable<Product[]> {  
        let params = new HttpParams();
        params = params.set('user_id', user_id);
        
        return this.http.get<Product[]>(`${this.url}/products`, { params, headers: this.httpHeaders }).pipe(
            catchError((e) => {
                this.alertService.alert(e?.error?.detail, 'error');
                return throwError(() => e);
            })
        );
    }

    public consultProductsByCompany(company_id: number): Observable<Product[]> {  
        let params = new HttpParams();
        params = params.set('company_id', company_id);
        
        return this.http.get<Product[]>(`${this.url}/products`, { params, headers: this.httpHeaders }).pipe(
            catchError((e) => {
                this.alertService.alert(e?.error?.detail, 'error');
                return throwError(() => e);
            })
        );
    }
}
