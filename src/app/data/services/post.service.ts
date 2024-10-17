import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Page} from '../../interfaces/page.interface';
import {Post} from '../../interfaces/post.interface';
import {Comments} from '../../interfaces/comments.interface';

@Injectable({
  providedIn: 'root',
})

export class PostService {
  private baseApiUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}

  getPosts(id: number = -1 , page: number = 0, size: number = 10): Observable<Page<Post>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<Post>>(`${this.baseApiUrl}/posts/user/${id}`, { params });
  }

  addPost(content: string) {
    return this.http.post<Post>(`${this.baseApiUrl}/posts/add`, {"content" : content});
  }

  getComments(postId: number, page: number = 0, size: number = 5): Observable<Page<Comments>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<Comments>>(`${this.baseApiUrl}/comments/post/${postId}`, { params });
  }

  addComment(postId: number, content: string) {
    return this.http.post<Comments>(`${this.baseApiUrl}/comments/post/${postId}/add`, {"content" : content});
  }

  likePost(postId: number) {
    return this.http.post(`${this.baseApiUrl}/posts/${postId}/like`, {});
  }

  unlikePost(postId: number) {
    return this.http.delete(`${this.baseApiUrl}/posts/${postId}/like`, {});
  }
}
