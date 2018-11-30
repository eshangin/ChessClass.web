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
import {FormGroup, FormBuilder, FormControl, Validators, FormArray} from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {SelectFavoritesModalComponent} from '../select-favorites-modal/select-favorites-modal.component';

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
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private classService: SchoolClassService,
    private pupilService: PupilService,
    private puzzleService: PuzzleService,
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      formPuzzles: this.formBuilder.array([], Validators.required)
    });
    this.classId = this.route.snapshot.paramMap.get('id');
    this.classService.getClasses().subscribe(classes => this.myClasses = classes);
    this.loadPupils();
  }

  onClassChange() {
    this.loadPupils();
  }

  onAddPuzzles() {
    this.getPuzzles(this.addPuzzlesCount).subscribe(puzzles => {
      this.pushPuzzles(puzzles);
    });    
  }

  removePuzzle(index) {
    this.selectedPuzzles.splice(index, 1);
    this.formPuzzles.removeAt(index);
  }

  onAddFromFavoriteClick() {
    const modalRef = this.modalService.open(SelectFavoritesModalComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
    modalRef.result.then((result) => {
      this.pushPuzzles(result.puzzles);
    }, () => {});
  }

  private pushPuzzles(puzzles: Puzzle[]) {
    this.selectedPuzzles.push(...puzzles);
    puzzles.forEach(_ => this.formPuzzles.push(new FormControl()));
  }

  get formPuzzles(): FormArray {
    return this.form.get('formPuzzles') as FormArray;
  }

  onApplyHomeworkClick() {
    if (this.form.valid) {
      const puzzleIds = this.selectedPuzzles.map(_ => _.id);

      this.classService.addHomework(this.classId, puzzleIds, this.selectedPupilId).subscribe(() => {
        this.toastr.success('Домашнее задание назначено!');
        this.router.navigate(['home']);
      });
    }
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
