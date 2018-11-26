import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SchoolClassService} from 'src/app/services/school-class.service';
import {SchoolClass} from 'src/app/services/school-class.model';
import {PupilService} from 'src/app/services/pupil.service';
import {Pupil} from 'src/app/services/pupil.model';
import {PuzzleService} from 'src/app/services/puzzle.service';
import {Observable, Subscription} from 'rxjs';
import {Puzzle} from 'src/app/services/puzzle.model';

interface IPuzzleSet {
  puzzles: Puzzle[]
}

@Component({
  selector: 'app-add-homework',
  templateUrl: './add-homework.component.html',
  styleUrls: ['./add-homework.component.scss']
})
export class AddHomeworkComponent implements OnInit {

  classId: string;
  myClasses: SchoolClass[] = [];
  selectedPupil: string = null;
  classPupils: Pupil[] = [];
  puzzleSets: IPuzzleSet[] = [];

  constructor(
    private route: ActivatedRoute,
    private classService: SchoolClassService,
    private pupilService: PupilService,
    private puzzleService: PuzzleService) { }

  ngOnInit() {
    this.classId = this.route.snapshot.paramMap.get('id');
    this.classService.getClasses().subscribe(classes => this.myClasses = classes);
    this.loadPupils();
    this.getPuzzles().subscribe(puzzles => this.puzzleSets.push({ puzzles: puzzles }));
  }

  onClassChange() {
    this.loadPupils();
  }

  private getPuzzles(): Observable<Puzzle[]> {
    // TODO :: take X puzzles of specific type (checkmate in 2 moves/3 moves/etc.)
    return this.puzzleService.getPuzzles();
  }

  private loadPupils(): Subscription {
    return this.pupilService.getPupils(this.classId).subscribe(pupils => {
      this.selectedPupil = null;
      this.classPupils = pupils;
    });
  }
}
