import {Component} from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {ChatInputComponent} from '../chat-input/chat-input.component';
import {ChatService} from '../../../data/services/chat.service';
import {WebSocketService} from '../../../data/services/websocket.service';
import {Chat, Participants} from '../../../interfaces/chat.interface';
import {Message} from '../../../interfaces/message.interface';
import {ProfileService} from '../../../data/services/profile.service';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [
    NgClass,
    ChatInputComponent,
    NgForOf,
    NgIf,
    DatePipe
  ],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.scss'
})

export class ChatWindowComponent {
  chat: Chat | undefined;
  messages: Message[] = [];
  currentPage = 0;
  loading = false;

  currentUser: Participants = {
    id: 0,
    username: '',
    avatarUrl: ''
  };

  chatParticipant: Participants = {
    id: 0,
    username: '',
    avatarUrl: ''
  };

  constructor(
    private chatService: ChatService,
    private webSocketService: WebSocketService,
    private profileService: ProfileService
  ) {}

  loadChat(chat: Chat) {
    this.chat = chat;
    this.messages = [];
    this.currentPage = 0;

    this.profileService.getMe().subscribe(currentUser => {
      this.currentUser = currentUser;
      this.chatParticipant = chat.participants.find(participant => participant.id !== this.currentUser.id) || { id: 0, username: '', avatarUrl: '' };
    });

    this.loadMessages();

    this.webSocketService.connect(this.chat.id).subscribe((message) => {
      this.messages.unshift(message);
    });
  }

  loadMessages() {
    if (!this.chat || this.loading) return;

    this.loading = true;

    const previousScrollHeight = document.querySelector('.chat-window__body')?.scrollHeight || 0;

    this.chatService.getChatMessages(this.chat.id, this.currentPage, 10).subscribe((data) => {
      const newMessages = data._embedded ? data._embedded['messageDtoes'] : [];
      this.messages = [...this.messages, ...newMessages];
      this.currentPage++;
      this.loading = false;

      setTimeout(() => {
        const chatBody = document.querySelector('.chat-window__body') as HTMLElement;
        chatBody.scrollTop = chatBody.scrollHeight - previousScrollHeight;
      }, 10);
    });
  }

  onScroll(event: any) {
    if (event.target.scrollTop === -2 && !this.loading) {
      this.loadMessages();
    }
  }

  onMessageSent(content: string) {
    if (this.chat) {
      this.webSocketService.sendMessage(this.chat.id, content, this.currentUser.username);
    }
  }
}
