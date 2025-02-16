import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, tap, throwError} from 'rxjs';
import {TokenResponse} from './auth.service.interface';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);
  cookieService = inject(CookieService);
  router = inject(Router);

  accessToken: string | null = null;
  refreshToken: string | null = null;
  refreshTokenTimeout: any;

  get isAuth() {
    if (!this.accessToken) {
      this.accessToken = this.cookieService.get('accessToken');
      this.refreshToken = this.cookieService.get('refreshToken');
    }
    return !!this.accessToken;
  }

  login(payload: { username: string; password: string }) {
    return this.http.post<TokenResponse>('http://localhost:8080/api/v1/auth/login', payload).pipe(
      tap(val => this.saveTokens(val))
    );
  }

  refreshAuthToken() {
    return this.http.post<TokenResponse>('http://localhost:8080/api/v1/auth/refresh', { 'refreshToken': this.refreshToken }).pipe(
      tap(response => this.saveTokens(response)),
      catchError(err => {
        this.logout();
        return throwError(() => new Error('Refresh token expired', err));
      })
    );
  }

  logout() {
    this.cookieService.deleteAll();
    this.accessToken = null;
    this.refreshToken = null;
    clearTimeout(this.refreshTokenTimeout);
    this.router.navigate(['/login']).then();
  }

  saveTokens(val: TokenResponse) {
    this.accessToken = val.accessToken;
    this.refreshToken = val.refreshToken;

    this.cookieService.set('accessToken', this.accessToken);
    this.cookieService.set('refreshToken', this.refreshToken);

    const expiresIn = this.decodeTokenExpiration(val.accessToken) - 60;
    this.scheduleRefresh(expiresIn * 1000);
  }

  private decodeTokenExpiration(token: string): number {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp - Math.floor(Date.now() / 1000);
  }

  private scheduleRefresh(expiresInMs: number) {
    clearTimeout(this.refreshTokenTimeout);
    this.refreshTokenTimeout = setTimeout(() => {
      this.refreshAuthToken().subscribe();
    }, expiresInMs);
  }
}
