import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { TokenResponse } from './auth.service.interface';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.accessToken;

  if (req.url.includes('/auth/refresh')) {
    return next(req);
  }

  if (!token) return next(req);

  if (isRefreshing) {
    return refreshAndProceed(authService, req, next);
  }

  return next(addToken(req, token)).pipe(
    catchError(error => {
      if (error.status === 401) {
        return refreshAndProceed(authService, req, next);
      }
      return throwError(() => error);
    })
  );
};

const refreshAndProceed = (authService: AuthService, req: HttpRequest<any>, next: HttpHandlerFn) => {
  if (!isRefreshing) {
    isRefreshing = true;
    return authService.refreshAuthToken().pipe(
      switchMap((val: TokenResponse) => {
        isRefreshing = false;
        authService.accessToken = val.accessToken;
        return next(addToken(req, val.accessToken));
      }),
      catchError(error => {
        isRefreshing = false;
        authService.logout();
        return throwError(() => error);
      })
    );
  }
  return next(addToken(req, authService.accessToken!));
};

const addToken = (req: HttpRequest<any>, token: string) => {
  return req.clone({
    setHeaders: {
      'Authorization': `Bearer ${token}`
    }
  });
};
