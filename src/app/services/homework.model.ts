import {Puzzle} from "./puzzle.model";
import {HomeworkPupilStat} from "./homework-pupil-stat.model";

export class Homework {
    id: string;
    puzzles: Puzzle[];
    classId: string;
    dateCreated: Date;
    pupilStats: HomeworkPupilStat[];
}