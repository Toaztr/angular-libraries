import { Component } from '@angular/core';
import { DataService, SortType } from 'projects/ui-components/src/lib/infinite-paginator/infinite-paginator.component';
import { of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  teamMembersColumns = ['name', 'ref'];
  dataService?: DataService<Object>;

  constructor() {
    this.dataService = {
      fetch(cursor?: string, sort?: SortType) {
        return of({ data: [{name: "a", ref: "b"}, {name: "a", ref: "b"},{name: "a", ref: "b"},{name: "a", ref: "b"},{name: "a", ref: "b"},{name: "a", ref: "b"},{name: "a", ref: "b"},{name: "a", ref: "b"},{name: "a", ref: "b"},{name: "a", ref: "b"},{name: "a", ref: "b"}, {name: "a", ref: "b"}, {name: "a", ref: "b"}]}).toPromise()
          .catch(err => {
            return Promise.reject(err);
          })
      }
    }
  }
}
