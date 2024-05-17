import {EventEmitter, Injectable} from '@angular/core';
import {Meta, Title} from "@angular/platform-browser";
import {environment} from "../../environments/environment";

export class PagePosition {
  pageName: string;
  pagination: number;
  scrollPosition: number;
  ageCategorySelected: any;
  genreSelected: any;
  sortSelected: any;

  constructor(position: any) {
    this.pageName = position.pageName;
    this.pagination = position.pagination;
    this.scrollPosition = position.scrollPosition;
    this.ageCategorySelected = position.ageCategorySelected;
    this.genreSelected = position.genreSelected;
    this.sortSelected = position.sortSelected;
  }
}

@Injectable({
  providedIn: 'root'
})

export class PageService {

  endOfPage: EventEmitter<any> = new EventEmitter();

  metaTagDescription: HTMLMetaElement | null;

  pagePosition: PagePosition = new PagePosition({
    pageName: '',
    pagination: 1,
    scrollPosition: 0
  });

  constructor(
    private meta: Meta,
    private title: Title,

  ) {
  }

  setMetaTagDescription(description: string) {
    this.metaTagDescription = this.meta.addTag({ name: 'description',
      content: description
    })
  }

  setMetaTagBase() {
    this.metaTagDescription = this.meta.addTag({ name: 'description',
      content: environment.pageDescription
    })
  }

  removeMetaTagDescription() {
    if (this.metaTagDescription) {
      this.meta.removeTagElement( this.metaTagDescription);
    }
  }

  setTitle(title: string) {
    this.title.setTitle(title)
  }

  removeTitle() {
    this.title.setTitle("");
  }

  setBaseTitle() {
    this.title.setTitle(environment.pageTitle);
  }

  setPagePosition(position: any) {
    this.pagePosition = new PagePosition(position);
  }

  getPosition(): PagePosition {
    return this.pagePosition;
  }

  setBasePosition() {
    this.pagePosition.pageName = '';
    this.pagePosition.pagination = 1;
    this.pagePosition.scrollPosition = 0;

  }



}
