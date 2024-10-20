import {Component, inject} from '@angular/core';
import {ProfileHeaderComponent} from '../../common-ui/profile-header/profile-header.component';
import {ProfileService} from '../../data/services/profile.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {switchMap} from 'rxjs';
import {toObservable} from '@angular/core/rxjs-interop';
import {AsyncPipe} from '@angular/common';
import {SvgIconComponent} from '../../common-ui/svg-icon/svg-icon.component';
import {SubscriberCardComponent} from '../../common-ui/sidebar/subscriber-card/subscriber-card.component';
import {UserInterface} from '../../interfaces/usersList.interface';
import {PostFeedComponent} from './post-feed/post-feed.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    ProfileHeaderComponent,
    AsyncPipe,
    SvgIconComponent,
    RouterLink,
    SubscriberCardComponent,
    PostFeedComponent
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})

export class ProfilePageComponent {
  profileService = inject(ProfileService)
  route = inject(ActivatedRoute)

  subs: UserInterface[] = []

  me$ = toObservable(this.profileService.me)

  showSettings: boolean = false;

  profile$ = this.route.params.pipe(
    switchMap(({id}) => {
      if(id === 'me') {
        this.loadSubscribers(-1);
        this.showSettings = true;
        return this.me$
      }

      this.showSettings = false;
      this.loadSubscribers(Number(id));
      return this.profileService.getAccount(id);
    })
  )

  loadSubscribers(id: number = -1){
    this.profileService.getSubscribers(id, 0, 5).subscribe(res => {
      this.subs = res;
    })
  }
}
