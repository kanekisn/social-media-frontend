import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import {Client, IMessage} from '@stomp/stompjs';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client;

  constructor() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000, // перезапуск через 5 секунд
      debug: (str) => console.log(str),
    });
  }

  connect(chatId: number | undefined): Observable<any> {
    const messages = new Subject<any>();

    this.stompClient.onConnect = () => {
      this.stompClient.subscribe(`/topic/messages/${chatId}`, (msg: IMessage) => {
        messages.next(JSON.parse(msg.body));
      });
    };

    this.stompClient.activate();

    return messages.asObservable();
  }

  sendMessage(chatId: number | undefined, content: string, sender: string) {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.publish({
        destination: `/app/chat/${chatId}/sendMessage`,
        body: JSON.stringify({ content: content, senderUsername: sender }),
      });
    }
  }
}
