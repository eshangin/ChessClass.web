import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ChatMessage } from './chat-message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private http: HttpClient
  ) { }

  getHomeworkPuzzleMessages(pupilId: string, homeworkId: string, puzzleId: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`/api/pupils/${pupilId}/homeworks/${homeworkId}/puzzles/${puzzleId}/chat-messages`);
  }

  sendHomeworkPuzzleMessage(pupilId: string, homeworkId: string, puzzleId: string, text: string): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(`/api/pupils/${pupilId}/homeworks/${homeworkId}/puzzles/${puzzleId}/chat-messages`, {
      text
    });
  }
}
