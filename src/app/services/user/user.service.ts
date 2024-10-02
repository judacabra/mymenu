import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';

import { AlertService } from '@services/alertService/alert.service';

import { User } from '@core/interfaces/user'; 
import { UserLogged } from '@core/interfaces/user_logged';

@Injectable({
    providedIn: 'root'
})

export class UserService {
    private url = `${environment.apiUrl}`;

    private httpHeaders = new HttpHeaders({
        'Accept': 'application/json'
    });

    constructor(private http: HttpClient, private alertService: AlertService) { }

    public consultUsers(user_id: number): Observable<User[]> {    
        let params = new HttpParams();
        params = params.set('user_id', user_id);

        return this.http.get<User[]>(`${this.url}/users`, { params, headers: this.httpHeaders }).pipe(
            catchError((e) => {
                this.alertService.alert(e?.error?.detail, 'error');
                return throwError(() => e);
            })
        );
    }

    public get_logged_info(username: string): Observable<UserLogged> { 
        let params = new HttpParams();
        params = params.set('username', username);

        return this.http.get<UserLogged>(`${this.url}/logged_user`, { params, headers: this.httpHeaders }).pipe(
            catchError((e) => {
                this.alertService.alert(e?.error?.detail, 'error');
                return throwError(() => e);
            })
        );
    }
}
