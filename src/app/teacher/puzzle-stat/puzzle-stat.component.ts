import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PuzzleService } from 'src/app/services/puzzle.service';
import { Puzzle } from 'src/app/services/puzzle.model';
import { Pupil } from 'src/app/services/pupil.model';
import { SchoolClass } from 'src/app/services/school-class.model';
import { Homework } from 'src/app/services/homework.model';
import { User } from 'src/app/services/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { ChatMessage } from 'src/app/services/chat-message.model';

@Component({
  selector: 'app-puzzle-stat',
  templateUrl: './puzzle-stat.component.html',
  styleUrls: ['./puzzle-stat.component.scss']
})
export class PuzzleStatComponent implements OnInit {

  homeworkId: string;
  puzzleId: string;
  viewMode: string = 'list';
  class: SchoolClass;
  homework: Homework;
  puzzle: Puzzle;
  whoFixed: any[] = [];
  whoNotFixed: any[] = [];
  selectedPupil: Pupil;
  chatMessage: string = '';
  chatMessages: ChatMessage[] = [];

  constructor(
    private route: ActivatedRoute,
    private puzzleService: PuzzleService,
    private chatService: ChatService
  ) { }

  ngOnInit() {
    this.homeworkId = this.route.snapshot.paramMap.get('homeworkId');
    this.puzzleId = this.route.snapshot.paramMap.get('puzzleId');

    this.loadStatistics();
  }

  viewChat(pupil: Pupil) {
    this.selectedPupil = pupil;
    this.chatMessage = '';
    this.chatMessages = [];
    this.viewMode = 'chat';

    this.chatService.getHomeworkPuzzleMessages(pupil.id, this.homework.id, this.puzzle.id).subscribe(messages => {
      this.chatMessages = messages;
    });
  }

  sendMessage(pupil: Pupil) {
    if (this.chatMessage.trim() != '') {
      this.chatService.sendHomeworkPuzzleMessage(pupil.id, this.homework.id, this.puzzle.id, 
        this.chatMessage).subscribe(createdMessage => {
          this.chatMessages.push(createdMessage);
          this.chatMessage = '';    
        });
    }
  }

  closeChat() {
    this.selectedPupil = null;
    this.viewMode = 'list';
    this.loadStatistics();
  }

  editChatMessage(chatMessage: ChatMessage) {
    // TODO :: edit message logic
    console.log(chatMessage);
  }

  private loadStatistics() {
    this.puzzleService.getPuzzleFixStatistics(this.homeworkId, this.puzzleId).subscribe(stat => {
      this.class = stat.class;
      this.homework = stat.homework;
      this.puzzle = stat.puzzle;
      this.whoFixed = stat.statistics.filter(item => item.fixedByPupil);
      this.whoNotFixed = stat.statistics.filter(item => !item.fixedByPupil);
    });
  }
}
