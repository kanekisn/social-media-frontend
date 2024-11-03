import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Page} from '../../interfaces/page.interface';
import {Chat} from '../../interfaces/chat.interface';
import {Message} from '../../interfaces/message.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}

  getChatMessages(chatId: number | undefined, page: number, size: number) {
    return this.http.get<Page<Message>>(`${this.apiUrl}/messages/${chatId}?page=${page}&size=${size}`);
  }

  getChats(page: number = 0, size: number = 5) {
    return this.http.get<Page<Chat>>(`${this.apiUrl}/chats/my-chats?page=${page}&size=${size}`);
  }
}
