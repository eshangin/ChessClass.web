import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SchoolClassService} from 'src/app/services/school-class.service';
import {SchoolClass} from 'src/app/services/school-class.model';
import {PupilService} from 'src/app/services/pupil.service';
import {Pupil} from 'src/app/services/pupil.model';
import {PuzzleService} from 'src/app/services/puzzle.service';
import {Observable, Subscription} from 'rxjs';
import {Puzzle} from 'src/app/services/puzzle.model';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-add-homework',
  templateUrl: './add-homework.component.html',
  styleUrls: ['./add-homework.component.scss']
})
export class AddHomeworkComponent implements OnInit {

  classId: string;
  myClasses: SchoolClass[] = [];
  selectedPupilId: string = null;
  classPupils: Pupil[] = [];
  selectedPuzzles: Puzzle[] = [];
  addPuzzlesCount: number = 3;

  constructor(
    private route: ActivatedRoute,
    private classService: SchoolClassService,
    private pupilService: PupilService,
    private puzzleService: PuzzleService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.classId = this.route.snapshot.paramMap.get('id');
    this.classService.getClasses().subscribe(classes => this.myClasses = classes);
    this.loadPupils();
  }

  onClassChange() {
    this.loadPupils();
  }

  onAddPuzzles() {
    this.getPuzzles(this.addPuzzlesCount).subscribe(puzzles => this.selectedPuzzles.push(...puzzles));
  }

  onApplyHomeworkClick() {
    const puzzleIds = this.selectedPuzzles.map(_ => _.id);
    this.classService.addHomework(this.classId, puzzleIds, this.selectedPupilId).subscribe(() => {
      this.toastr.success('Домашнее задание назначено!');
      this.router.navigate(['dashboard']);
    });
  }

  private getPuzzles(count: number): Observable<Puzzle[]> {
    // TODO :: take X puzzles of specific type (checkmate in 2 moves/3 moves/etc.)
    return this.puzzleService.getPuzzles(count);
  }

  private loadPupils(): Subscription {
    return this.pupilService.getPupils(this.classId).subscribe(pupils => {
      this.selectedPupilId = null;
      this.classPupils = pupils;
    });
  }
}
