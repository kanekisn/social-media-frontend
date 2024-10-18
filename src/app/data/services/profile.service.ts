import {inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {UserInterface} from '../../interfaces/usersList.interface';
import {map, Observable, tap} from 'rxjs';
import {Page} from '../../interfaces/page.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  http = inject(HttpClient);

  baseApiUrl = 'http://localhost:8080/api/v1/'

  me = signal<UserInterface | null>(null)

  getAllUsers(): Observable<UserInterface[]> {
    return this.http.get<UserInterface[]>(`${this.baseApiUrl}users/all`)
  }

  getMe(){
    return this.http.get<UserInterface>(`${this.baseApiUrl}users/me`).pipe(
      tap(res => this.me.set(res))
    );
  }

  getAccount(id: string) {
    return this.http.get<UserInterface>(`${this.baseApiUrl}users/get-user/${id}`)
  }

  getSubscribers(id: number = -1, page: number = 0, size: number = 10) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    const getUrl = id === -1 ? 'users/me/followers' : `users/${id}/followers`;

    return this.http.get<Page<UserInterface>>(`${this.baseApiUrl}${getUrl}`, { params }).pipe(
      map(response => {
        const embedded = response._embedded || {};
        const key = Object.keys(embedded)[0] || '';
        return embedded[key] || [];
      })
    );
  }

  patchUser(profile: Partial<UserInterface>) {
    return this.http.patch(`${this.baseApiUrl}users/me`, profile)
  }
}
