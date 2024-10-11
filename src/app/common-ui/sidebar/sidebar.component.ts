import {Component, inject, OnInit} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {SvgIconComponent} from '../svg-icon/svg-icon.component';
import {SubscriberCardComponent} from './subscriber-card/subscriber-card.component';
import {RouterLink} from '@angular/router';
import {ProfileService} from '../../data/services/profile.service';
import {UserInterface} from '../../interfaces/usersList.interface';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    NgOptimizedImage,
    SvgIconComponent,
    SubscriberCardComponent,
    RouterLink
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  profileService = inject(ProfileService)
  subs: UserInterface[] = []

  me = this.profileService.me

  ngOnInit() {
    this.profileService.getSubscribersShortList().subscribe(res => {
      this.subs = res;
    })

    firstValueFrom(this.profileService.getMe()).then()
  }

  menuItems = [
    {
      'label': 'Моя страница',
      'icon': 'home',
      'link': ''
    },
    {
      'label': 'Чаты',
      'icon': 'chat',
      'link': 'chats'
    },
    {
      'label': 'Поик',
      'icon': 'search',
      'link': 'search'
    }
  ]
}
