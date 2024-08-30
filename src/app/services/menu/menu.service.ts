import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';

import { TypeUrl } from '@core/interfaces/type-url'; 

@Injectable({
    providedIn: 'root'
})

export class MenuService {
    private url = `${environment.apiUrl}`;

    private httpHeaders = new HttpHeaders({
        'Accept': 'application/json'
    });

    constructor(private http: HttpClient) { }

    public consultTypes(): Observable<TypeUrl[]> {    
        return this.http.get<TypeUrl[]>(`${this.url}/type/menu`, { headers: this.httpHeaders }).pipe(
            catchError((e) => {
                alert(e?.error?.detail);
                return throwError(() => e);
            })
        );
    }
}