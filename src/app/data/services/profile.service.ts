import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserInterface} from '../../interfaces/usersList.interface';
import {map, Observable, shareReplay, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  http = inject(HttpClient);

  baseApiUrl = 'http://localhost:8080/api/v1/'

  me = signal<UserInterface | null>(null)

  getAllUsers(): Observable<UserInterface[]> {
    return this.http.get<UserInterface[]>(`${this.baseApiUrl}users/all`).pipe(
      shareReplay(1)
    );
  }

  getMe(){
    return this.http.get<UserInterface>(`${this.baseApiUrl}users/me`).pipe(
      shareReplay(1),
      tap(res => this.me.set(res))
    );
  }

  getSubscribersShortList() {
    return this.http.get<UserInterface[]>(`${this.baseApiUrl}users/me/followers`).pipe(
      map(res => res.slice(0, 3)),
      shareReplay(1)
    )
  }
}
