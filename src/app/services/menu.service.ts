  import { Injectable } from '@angular/core';
  import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor() { }

  public leftMenuState$ = new Subject<boolean>();

  public changeMenuState(leftMenuState: boolean) {
    this.leftMenuState$.next(leftMenuState);
  }

}
