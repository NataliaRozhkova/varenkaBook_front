import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {MatDialog} from "@angular/material/dialog";

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable()
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {


  dialogRef: any;
  constructor(
    public dialog: MatDialog,
  ) {
  }
  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
    return component.canDeactivate()
  }
}
