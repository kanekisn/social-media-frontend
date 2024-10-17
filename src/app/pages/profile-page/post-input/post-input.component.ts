import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {PostService} from '../../../data/services/post.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-post-input',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss'
})
export class PostInputComponent {
  postService = inject(PostService);
  router = inject(Router);

  form = new FormGroup({
    content: new FormControl('', Validators.required)
  })

  addPost() {
    if(this.form.valid && this.form.value.content) {
      this.postService.addPost(this.form.value.content).subscribe(val => {
        if(val) {
          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]).then();
          });
        }
      })
    }
  }
}
