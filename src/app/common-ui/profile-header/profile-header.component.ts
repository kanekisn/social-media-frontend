import {Component, input} from '@angular/core';
import {UserInterface} from '../../interfaces/usersList.interface';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss'
})
export class ProfileHeaderComponent {
  profile = input<UserInterface>()
}
