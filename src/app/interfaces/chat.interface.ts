export interface Chat {
  id: number;
  participants: Participants[];
  messageCount: number | null;
  lastMessage: string | null;
  lastMessageTime: string | null;
}

export interface Participants {
  id: number;
  username: string;
  avatarUrl?: string | null;
}
