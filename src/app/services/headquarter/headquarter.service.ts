import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { environment } from '../../../environments';

import { AlertService } from '@services/alertService/alert.service';
import { Headquarter } from '@core/interfaces/headquarter';

@Injectable({
    providedIn: 'root'
})

export class HeadquarterService {
    private url: string = `${environment.apiUrl}`;

    private httpHeaders: HttpHeaders = new HttpHeaders({
        'Accept': 'application/json',
    });

    constructor(
        private http: HttpClient,
        private alertService: AlertService
    ) { }

    public consultHeadquarters(): Observable<Headquarter[]> {
        return this.http.get<Headquarter[]>(`${this.url}/headquarters`, { headers: this.httpHeaders }).pipe(
            catchError((e) => {
                this.alertService.alert(e?.error?.detail, 'error');
                return throwError(() => e);
            })
        );
    }

    public getHeadquarterById(id: number): Observable<Headquarter> {
        let params: HttpParams = new HttpParams();
        params = params.set('id', id);


        return this.http.get<Headquarter>(`${this.url}/headquarter_by_id`, { params, headers: this.httpHeaders }).pipe(
            catchError((e) => {
                this.alertService.alert(e?.error?.detail, 'error');
                return throwError(() => e);
            })
        );
    }

    public setHeadquarter(data: any): Observable<Headquarter> {
        return this.http.post<Headquarter>(`${this.url}/headquarter`, data, { headers: this.httpHeaders }).pipe(
            catchError((e) => {
                this.alertService.alert(e?.error?.detail, 'error');
                return throwError(() => e);
            })
        );
    }

    public updateHeadquarter(id: number, data: any): Observable<Headquarter> {
        return this.http.put<Headquarter>(`${this.url}/headquarter/${id}`, data, { headers: this.httpHeaders }).pipe(
            catchError((e) => {
                this.alertService.alert(e?.error?.detail, 'error');
                return throwError(() => e);
            })
        );
    }
}
