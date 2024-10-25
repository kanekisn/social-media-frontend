import { Component } from '@angular/core';
import {NgClass} from '@angular/common';
import {ChatInputComponent} from '../chat-input/chat-input.component';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [
    NgClass,
    ChatInputComponent
  ],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.scss'
})
export class ChatWindowComponent {

}
