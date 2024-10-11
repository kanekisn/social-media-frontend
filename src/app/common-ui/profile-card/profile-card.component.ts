import {Component, inject, OnInit} from '@angular/core';
import {ProfileService} from '../../data/services/profile.service';
import {UserInterface} from '../../interfaces/usersList.interface';
import {of} from 'rxjs';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss'
})
export class ProfileCardComponent implements OnInit{
  profileService = inject(ProfileService)
  data : UserInterface[] = []

  ngOnInit() {
    this.profileService.getAllUsers().subscribe(
      (response: UserInterface[]) => {
        this.data = response;
      }
    )
  }

  protected readonly of = of;
}
