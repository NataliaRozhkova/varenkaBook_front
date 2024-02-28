import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanDeactivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {MatDialog} from "@angular/material/dialog";

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

export interface ComponentCanActivate {
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


@Injectable()
export class ActivateGuard implements CanActivate   {
  constructor(
    // private permissions: Permissions,
  private router: Router
  ) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : boolean{

    const nav = this.router.getCurrentNavigation();

    if (nav?.id === 1 || nav?.previousNavigation == null) {
      this.router.navigate(['/cart']);
      return false;
    } else {
      return true;
    }
  }
}
