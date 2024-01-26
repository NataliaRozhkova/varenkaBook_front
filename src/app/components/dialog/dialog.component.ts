import {Component, Input, Output} from '@angular/core';
import {Subject} from "rxjs";
import {Router} from "@angular/router";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.less']
})
export class DialogComponent {

  // private destroySubject: Subject<void> = new Subject();

  constructor(
    // private router: Router,
    public dialogRef: MatDialogRef<DialogComponent>,

  ) {
  }

  ngOnInit() {
  }

  openDialog() {
  }

  onCancelUserDialog(): void {
    this.dialogRef.close();
  }

  //
  // ngOnDestroy() {
  //   this.destroySubject.next();
  // }


}
