import {EventEmitter, Injectable} from '@angular/core';
import {Meta, Title} from "@angular/platform-browser";
import {environment} from "../../environments/environment";
import {Observable, Subject} from "rxjs";
import {StorageService} from "./storage.service";

export class PagePosition {
  pageName: string;
  pagination: number;
  scrollPosition: number;
  ageCategorySelected: any;
  genreSelected: any;
  sortSelected: any;
  pageHeight: number;

  constructor(position: any) {
    this.pageName = position.pageName;
    this.pagination = position.pagination;
    this.scrollPosition = position.scrollPosition;
    this.ageCategorySelected = position.ageCategorySelected;
    this.genreSelected = position.genreSelected;
    this.sortSelected = position.sortSelected;
    this.pageHeight = position.pageHeight;
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

  pageEvent: Subject<any> = new Subject<any>()

  constructor(
    private meta: Meta,
    private title: Title,
    private storageService: StorageService
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
    this.storageService.setItem(this.pagePosition, 'position');
  }

  getPosition(): PagePosition {
        if (this.pagePosition.pageName) {
            return this.pagePosition;
        } else {
            return this.storageService.getItem ('position', '[]');
        }

  }

  setBasePosition() {
    this.pagePosition.pageName = 'base';
    this.pagePosition.pagination = 1;
    this.pagePosition.scrollPosition = 0;

  }



}
