import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ChatMessage } from 'src/app/services/chat-message.model';
import { ChatService } from 'src/app/services/chat.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-homework-puzzle-chat',
  templateUrl: './homework-puzzle-chat.component.html',
  styleUrls: ['./homework-puzzle-chat.component.scss']
})
export class HomeworkPuzzleChatComponent implements OnInit {

  chatMessage: string;
  chatMessages: ChatMessage[] = [];
  @Input() homeworkId: string;
  @Input() puzzleId: string;
  @Input() pupilId: string;
  @Output() private chatThreadLoaded = new EventEmitter<ChatMessage[]>();

  constructor(
    private chatService: ChatService,
    private authServie: AuthService
  ) { }

  ngOnInit() {
    this.chatService.getHomeworkPuzzleMessages(this.pupilId, this.homeworkId, this.puzzleId).subscribe(messages => {
      this.chatMessages = messages;
      console.log(messages);
      this.chatThreadLoaded.emit(messages);
    });
  }

  sendMessage() {
    if (this.chatMessage.trim() != '') {
      this.chatService.sendHomeworkPuzzleMessage(this.pupilId, this.homeworkId, this.puzzleId, 
        this.chatMessage).subscribe(createdMessage => {
          this.chatMessages.push(createdMessage);
          this.chatMessage = '';    
        });
    }
  }

  editChatMessage(chatMessage: ChatMessage) {
    // TODO :: edit message logic
    console.log(chatMessage);
  }

  canEditMessage(chatMessage: ChatMessage): boolean {
    return chatMessage.from.id == this.authServie.currentUser.id;
  }

}
