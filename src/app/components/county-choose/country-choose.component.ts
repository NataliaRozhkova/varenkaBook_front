import {Component,  OnDestroy, OnInit} from '@angular/core';
import {News} from "../../model/models";
import {NewsService} from "../../services/news.service";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'country-choose',
  templateUrl: './country-choose.component.html',
  styleUrls: ['./country-choose.component.less']
})
export class CountryChooseComponent implements  OnInit  {

     constructor(
    private newsService: NewsService,
  ) {
  }

  ngOnInit(): void {


  }


}
