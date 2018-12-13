import { Component, OnInit, Input } from '@angular/core';
import { ChatMessage } from 'src/app/services/chat-message.model';
import { ChatService } from 'src/app/services/chat.service';

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

  constructor(
    private chatService: ChatService
  ) { }

  ngOnInit() {
    this.chatService.getHomeworkPuzzleMessages(this.pupilId, this.homeworkId, this.puzzleId).subscribe(messages => {
      this.chatMessages = messages;
      console.log(messages);
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

}
