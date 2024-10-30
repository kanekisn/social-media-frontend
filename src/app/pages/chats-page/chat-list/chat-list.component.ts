import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {SvgIconComponent} from '../../../common-ui/svg-icon/svg-icon.component';
import {ChatService} from '../../../data/services/chat.service';
import {Chat} from '../../../interfaces/chat.interface';
import {ProfileService} from '../../../data/services/profile.service';
import {UserInterface} from '../../../interfaces/usersList.interface';
import {DatePipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [
    SvgIconComponent,
    DatePipe,
    NgIf
  ],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss'
})

export class ChatListComponent implements OnInit {
  chats: Chat[] = [];
  currentUser: UserInterface | undefined;
  currentPage = 0;
  loading = false;
  hasMoreChats = true;

  @Output() chatSelected = new EventEmitter<Chat>();

  profileService: ProfileService = inject(ProfileService);

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.loadChats();

    this.profileService.getMe().subscribe(currentUser => {
      this.currentUser = currentUser;
    });
  }

  loadChats() {
    if (this.loading || !this.hasMoreChats) return;

    this.loading = true;

    this.chatService.getChats(this.currentPage, 5).subscribe(data => {
      const newChats = data._embedded ? data._embedded['chatDtoes'] : [];
      this.chats = [...this.chats, ...newChats];
      this.currentPage++;

      if (data.page && data.page.totalPages <= this.currentPage) {
        this.hasMoreChats = false;
      }

      this.loading = false;
    });
  }

  selectChat(chat: Chat) {
    this.chatSelected.emit(chat);
  }
}
