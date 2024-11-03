import {Component, inject, Input, OnInit} from '@angular/core';
import {UserInterface} from '../../interfaces/usersList.interface';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss'
})
export class ProfileCardComponent {
  @Input() data!: UserInterface[];
}
