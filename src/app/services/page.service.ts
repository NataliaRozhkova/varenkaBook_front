import {EventEmitter, Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class PageService {

  endOfPage: EventEmitter<any> = new EventEmitter();

}
