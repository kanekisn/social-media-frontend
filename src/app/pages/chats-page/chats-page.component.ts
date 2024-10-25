import { Component } from '@angular/core';
import {ChatListComponent} from './chat-list/chat-list.component';
import {ChatWindowComponent} from './chat-window/chat-window.component';
import {ChatInputComponent} from './chat-input/chat-input.component';

@Component({
  selector: 'app-chats-page',
  standalone: true,
  imports: [
    ChatListComponent,
    ChatWindowComponent,
    ChatInputComponent
  ],
  templateUrl: './chats-page.component.html',
  styleUrl: './chats-page.component.scss'
})
export class ChatsPageComponent {

}
