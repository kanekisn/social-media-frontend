import {Component, inject, Input} from '@angular/core';
import {UserInterface} from '../../../interfaces/usersList.interface';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-subscriber-card',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './subscriber-card.component.html',
  styleUrl: './subscriber-card.component.scss'
})
export class SubscriberCardComponent {
  @Input() profile! : UserInterface;
}
