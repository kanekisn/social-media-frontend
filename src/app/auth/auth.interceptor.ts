import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import {BehaviorSubject, catchError, filter, switchMap, tap, throwError} from 'rxjs';
import { TokenResponse } from './auth.service.interface';

let isRefreshing$ = new BehaviorSubject<boolean>(false);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.accessToken;

  if (req.url.includes('/auth/refresh')) {
    return next(req);
  }

  if (!token) return next(req);

  if (isRefreshing$.value) {
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
  if (!isRefreshing$.value) {
    isRefreshing$.next(true);
    return authService.refreshAuthToken().pipe(
      switchMap((val: TokenResponse) => {
        return next(addToken(req, val.accessToken)).pipe(
          tap(() => {
            isRefreshing$.next(false);
            authService.accessToken = val.accessToken;
          })
        );
      }),
      catchError(error => {
        isRefreshing$.next(false);
        authService.logout();
        return throwError(() => error);
      })
    );
  }

  if (req.url.includes('refresh')) return next(addToken(req, authService.accessToken!));

  return isRefreshing$.pipe(
    filter(isRefreshing => !isRefreshing),
    switchMap(res => {
      return next(addToken(req, authService.accessToken!));
    })
  )
};

const addToken = (req: HttpRequest<any>, token: string) => {
  return req.clone({
    setHeaders: {
      'Authorization': `Bearer ${token}`
    }
  });
};
