import { Component, Input, OnInit } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Subject } from 'rxjs';

export type SortType = Exclude<SortDirection, ''>;

export interface ListResults<T> {
  meta?: {
    page?: {
      cursor?: string
    }
  },
  data?: T[]
}

export interface DataService<T> {
  fetch(cursor?: string, sort?: SortType): Promise<ListResults<T>>;
}

@Component({
  selector: 'tzr-infinite-paginator',
  templateUrl: './infinite-paginator.component.html',
  styleUrls: ['./infinite-paginator.component.css']
})
export class InfinitePaginatorComponent<T> implements OnInit {
  loading = false;
  hasNext = false;
  hasPrev = false;
  fromItem?: number;
  toItem?: number;

  dataSource = new Subject<T[]>();

  private pages: T[][] = [];
  private currentPage: number = 0;
  private sorting?: SortType;
  private cursor?: string;
  private resetAfterLoading = false;

  @Input() dataService?: DataService<T>;

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.pages = [];
    this.cursor = undefined;
    this.currentPage = 0;
    this.loadNextPage();
  }

  next() {
    if (this.currentPage < this.pages.length) {
      this.setPage(this.currentPage + 1);
    } else if (!!this.cursor) {
      this.loadNextPage();
    }
  }

  prev() {
    this.setPage(this.currentPage - 1);
  }

  first() {
    this.setPage(1);
  }

  sort(ev: { direction: SortDirection }) {
    this.sorting = ev.direction ? ev.direction : undefined; 
    if (this.loading) {
      this.resetAfterLoading = true;
    } else {
      this.refresh();
    }
  }

  private setPage(pageNumber: number) {
    if (pageNumber > 0 && pageNumber <= this.pages.length) {
      this.currentPage = pageNumber;
      const page = this.pages[this.currentPage - 1];

      this.dataSource.next(page);

      this.hasNext = this.currentPage < this.pages.length || !!this.cursor;
      this.hasPrev = this.currentPage > 1;

      if (page.length) {
        this.fromItem = this.pages.slice(0, this.currentPage - 1).map(a => a.length).reduce((a, b) => a + b, 0) + 1;
        this.toItem = this.fromItem + page.length - 1; 
      } else {
        this.fromItem = undefined;
        this.toItem = undefined;
      }
    }
  }

  private loadNextPage() {
    if (!this.loading && this.dataService) {
      this.loading = true;
      const pageNumber = this.currentPage;
      this.dataService.fetch(this.cursor, this.sorting).then(
        d => {
          this.cursor = d.meta?.page?.cursor;
          this.pages = [...this.pages, d.data ?? []];
          this.setPage(pageNumber + 1);
        }
      ).finally(() => {
        this.loading = false;
        if (this.resetAfterLoading) {
          this.resetAfterLoading = false;
          this.refresh();
        }
      });
    }
  }
}