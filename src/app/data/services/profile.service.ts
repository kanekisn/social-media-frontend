import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserInterface} from '../../interfaces/usersList.interface';
import {Observable, shareReplay, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  http = inject(HttpClient);

  baseApiUrl = 'http://localhost:8080/api/v1/'

  getAllUsers(): Observable<UserInterface[]> {
    return this.http.get<UserInterface[]>(`${this.baseApiUrl}users/all`).pipe(
      shareReplay(1)
    );
  }
}
