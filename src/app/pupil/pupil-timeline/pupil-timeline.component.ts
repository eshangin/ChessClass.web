import { Component, OnInit, Input } from '@angular/core';
import { _ } from 'underscore';
import * as moment from 'moment';
import { PupilService } from 'src/app/services/pupil.service';
import { PupilActivity } from 'src/app/services/pupil-activity.model';

class ActivityGroup {
  activityDate: Date;
  activities: PupilActivity[] = [];
}

@Component({
  selector: 'app-pupil-timeline',
  templateUrl: './pupil-timeline.component.html',
  styleUrls: ['./pupil-timeline.component.scss']
})
export class PupilTimelineComponent implements OnInit {

  @Input() pupilId: string;
  activityGroups: ActivityGroup[] = [];

  constructor(
    private pupilService: PupilService) { }

  ngOnInit() {
    this.pupilService.getActivities(this.pupilId).subscribe(pupilActivities => {

      const occurrenceDay = function(h) {
        return moment(h.dateCreated).startOf('day').format();
      };      

      const groupToDay = function(group, day) {
          return {
              activityDate: day,
              activities: _(group).sortBy('dateCreated')
          } as ActivityGroup
      };
      
      this.activityGroups = _.chain(pupilActivities)
        .groupBy(occurrenceDay)
        .map(groupToDay)
        .sortBy('activityDate')
        .reverse()
        .value();
    });
  }

}
