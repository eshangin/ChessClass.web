export class PupilActivity {
    data: any;
    title: string;
    dateCreated: Date;
    activityType: PupilActivityType;
}

export enum PupilActivityType {
    HomeworkAdded = 1,
    PuzzleFixed
}