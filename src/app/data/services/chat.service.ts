import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Page} from '../../interfaces/page.interface';
import {Chat} from '../../interfaces/chat.interface';
import {Message} from '../../interfaces/message.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private stompClient: any;
  private serverUrl = 'http://localhost:8080/chat-websocket';  // WebSocket URL
  private apiUrl = 'http://localhost:8080/api/v1';  // API URL

  constructor(private http: HttpClient) {}

  // Получение сообщений через REST API с поддержкой HATEOAS
  getChatMessages(chatId: number | undefined, page: number, size: number) {
    return this.http.get<Page<Message>>(`${this.apiUrl}/messages/${chatId}?page=${page}&size=${size}`);
  }

  getChats(page: number = 0, size: number = 5) {
    return this.http.get<Page<Chat>>(`${this.apiUrl}/chats/my-chats?page=${page}&size=${size}`);
  }
}
