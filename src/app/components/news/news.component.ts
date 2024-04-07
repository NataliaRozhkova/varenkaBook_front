import {Component,  OnDestroy, OnInit} from '@angular/core';
import {News} from "../../model/models";
import {NewsService} from "../../services/news.service";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.less']
})
export class NewsComponent implements OnDestroy,OnInit  {

  news: News[] = [];
  newsCountOnPage: number = 6;
  filters: any = {};
  offset: number = 0;
  order: string = 'date'

  page: number = 1;
  total: number = 0;
  loading: boolean = true;

  private destroySubject: Subject<void> = new Subject();

  constructor(
    private newsService: NewsService,
  ) {
  }

  ngOnInit(): void {
    this.filters.limit = this.newsCountOnPage;
    this.filters.offset = this.offset;
    this.filters.ordering = this.order;
    this.change(1);

  }

  change($event: any) {
    this.news  = []

    this.filters.offset = ($event - 1) * this.newsCountOnPage + this.offset;

    this.loading = true;

    this.newsService.getNews(this.filters)
      .pipe(
        takeUntil(this.destroySubject),
      )
      .subscribe((res: any) => {
          this.news = res.results;
          this.total = res.count;
          this.page = $event;
          this.loading = false;

        },
        error => {
          this.loading = false;
        }
      )
  }
  ngOnDestroy() {
    this.destroySubject.next();
  }

  upPage(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}
