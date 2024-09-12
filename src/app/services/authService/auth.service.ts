import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Auth } from '@core/interfaces/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = `${environment.apiUrl}`;
  private httpHeaders = new HttpHeaders({
    'Accept': 'application/json'
  });

  constructor(private http: HttpClient, private router: Router) { }

  public login(username: string, pass: string): Observable<Auth> {
    let params = new URLSearchParams();
    params.set('username', username);
    params.set('password', pass);

    const transfer = this._getHttpTransfer();

    return this.http.post<Auth>(`${this.url}/login`, params.toString(), { headers: transfer }).pipe(
      catchError((e) => {
        alert(e?.error?.detail);
        return throwError(() => e);
      })
    );
  }

  private _getHttpTransfer(): HttpHeaders {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return httpHeaders;
  }

  public logout(): Observable<any> {
    return this.http.post<any>(`${this.url}/`, null, { headers: this.httpHeaders }).pipe(
      catchError((e) => {
        alert(e?.error?.detail);
        return throwError(() => e);
      })
    )
  }

  public isNotAuthorized(): void {
    this.endSession();
    this.router.navigate(['/admin']);

  }

  private endSession(): void {
    sessionStorage.clear();
    localStorage.clear();
  }
}
