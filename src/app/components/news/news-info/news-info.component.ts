import {AfterViewInit, Component, OnDestroy, OnInit} from "@angular/core";
import {map, Subject, switchMap} from "rxjs";
import {ImageService} from "../../../services/image.service";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {NewsService} from "../../../services/news.service";
import {News} from "../../../model/models";


@Component({
  selector: 'news-info',
  templateUrl: './news-info.component.html',
  styleUrls: ['./news-info.component.less',
  ]
})
export class NewsInfoComponent implements OnDestroy, OnInit, AfterViewInit{

  private destroySubject: Subject<void> = new Subject();

  news: News = new News();

  constructor(
    private route: ActivatedRoute,
    public imageService: ImageService,
    private newsService: NewsService,
  ) {
  }

  ngOnInit() {


    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
          return this.newsService.getNewsInfo(params?.get('id'));
        }
      ),
      map((res: News) => {
        this.news = res;
      })
    )
      .subscribe();
  }



  ngAfterViewInit() {

  }


  ngOnDestroy() {
    this.destroySubject.next();

  }



}
