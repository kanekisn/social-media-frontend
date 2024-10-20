import {Component, inject, OnInit} from '@angular/core';
import {PostInputComponent} from '../post-input/post-input.component';
import {PostComponent} from '../post/post.component';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [
    PostInputComponent,
    PostComponent
  ],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss'
})
export class PostFeedComponent implements OnInit {
  route = inject(ActivatedRoute);

  showCreatePostInput: boolean = false;

  ngOnInit() {
    this.route.params.subscribe(params => {
        const userId = params['id'];
        this.showCreatePostInput = userId === 'me';
      }
    );
  }
}
