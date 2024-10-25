import {AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {SvgIconComponent} from '../../../common-ui/svg-icon/svg-icon.component';
import {Post} from '../../../interfaces/post.interface';
import {PostService} from '../../../data/services/post.service';
import {CommonModule, DatePipe} from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {toObservable} from '@angular/core/rxjs-interop';
import {ProfileService} from '../../../data/services/profile.service';
import {finalize, map, of, switchMap} from 'rxjs';
import { debounce } from 'lodash';
import {Comments} from '../../../interfaces/comments.interface';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    SvgIconComponent,
    DatePipe,
    CommonModule,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})

export class PostComponent implements OnInit {
  posts: Post[] = [];
  userId!: number;
  page: number = 0;
  size: number = 4;
  loading: boolean = false;
  totalPosts: number = 0; // Добавляем общее количество постов

  commentPages: { [postId: number]: number } = {};
  comments: { [postId: number]: Comments[] } = {};
  totalComments: { [postId: number]: number } = {};
  activeComments: { [key: number]: boolean } = {};

  constructor(
    private postService: PostService,
    private route: ActivatedRoute
  ) {}

  profileService = inject(ProfileService);
  me$ = toObservable(this.profileService.me);

  form = new FormGroup({
    content: new FormControl<string>('', Validators.required)
  });

  ngOnInit() {
    this.route.params.pipe(
      switchMap(params => {
        let id = params['id'];
        if (id === 'me') {
          return this.me$.pipe(map(res => res!.id));
        }
        return of(Number(id));
      })
    ).subscribe(userId => {
      this.userId = userId;
      this.posts = [];
      this.page = 0;
      this.loadPosts(); // Загружаем первые посты
    });
  }

  loadPosts() {
    if (this.loading) return;

    this.loading = true;
    this.postService.getPosts(this.userId, this.page, this.size).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe(data => {
      const newPosts = this.extractEmbeddedData<Post>(data, 'postDtoes');
      this.posts = [...this.posts, ...newPosts];
      this.totalPosts = data.page.totalElements; // Обновляем общее количество постов
      this.page++;
    });
  }

  hasMorePosts(): boolean {
    return this.posts.length < this.totalPosts;
  }

  addComment(postId: number) {
    if (this.form.valid && this.form.value.content) {
      this.postService.addComment(postId, this.form.value.content).subscribe(val => {
        const post = this.posts.find(p => p.id === postId);

        if (post) {
          if (this.comments[postId]) {
            this.comments[postId] = [val, ...this.comments[postId]];
          } else {
            this.comments[postId] = [val];
          }

          post.commentsCount!++;

          if (this.totalComments[postId] !== undefined) {
            this.totalComments[postId]++;
          } else {
            this.totalComments[postId] = 1;
          }

          this.activeComments[postId] = true;

          this.loadComments(postId);

          this.form.reset();
        }
      });
    }
  }

  loadComments(postId: number) {
    const currentPage = this.commentPages[postId] || 0;

    this.postService.getComments(postId, currentPage, 3).subscribe(response => {
      const newComments = this.extractEmbeddedData<Comments>(response, 'commentDtoes');
      this.totalComments[postId] = response.page.totalElements;

      if (!this.comments[postId]) {
        this.comments[postId] = [];
      }

      const uniqueComments = newComments.filter(newCom => {
        return !this.comments[postId].some(existingCom => existingCom.id === newCom.id);
      });

      this.comments[postId] = [...this.comments[postId], ...uniqueComments];
      this.commentPages[postId] = currentPage + 1;
    });
  }

  toggleComments(postId: number) {
    if (this.activeComments[postId]) {
      this.activeComments[postId] = false;
    } else {
      this.activeComments[postId] = true;
      this.loadComments(postId);
    }
  }

  hasMoreComments(postId: number): boolean {
    return (this.comments[postId]?.length || 0) < (this.totalComments[postId] || 0);
  }

  likePost(postId: number) {
    const post = this.posts.find(post => post.id === postId);

    if (post) {
      if (!post.likedByCurrentUser) {
        post.likedByCurrentUser = true;
        post.likesCount++;

        this.postService.likePost(postId).subscribe({
          error: () => {
            post.likedByCurrentUser = false;
            post.likesCount--;
          }
        });
      } else {
        post.likedByCurrentUser = false;
        post.likesCount--;

        this.postService.unlikePost(postId).subscribe({
          error: () => {
            post.likedByCurrentUser = true;
            post.likesCount++;
          }
        });
      }
    }
  }

  private extractEmbeddedData<T>(data: any, key: string): T[] {
    return data._embedded ? data._embedded[key] || [] : [];
  }
}
