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

    public consultProfileById(id: number): Observable<Profile> {
        let params: HttpParams = new HttpParams();
        params = params.set('id', id);

        return this.http.get<Profile>(`${this.url}/profile_by_id`, { params, headers: this.httpHeaders }).pipe(
            catchError((e) => {
                this.alertService.alert(e?.error?.detail, 'error');
                return throwError(() => e);
            })
        );
    }

    public setProfile(data: any): Observable<Profile> {
        return this.http.post<Profile>(`${this.url}/profile`, data, { headers: this.httpHeaders }).pipe(
            catchError((e) => {
                this.alertService.alert(e?.error?.detail, 'error');
                return throwError(() => e);
            })
        );
    }

    public updateProfile(id: number, data: any): Observable<Profile> {
        return this.http.put<Profile>(`${this.url}/profile/${id}`, data, { headers: this.httpHeaders }).pipe(
            catchError((e) => {
                this.alertService.alert(e?.error?.detail, 'error');
                return throwError(() => e);
            })
        );
    }
}
