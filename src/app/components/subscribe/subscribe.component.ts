import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {News} from "../../model/models";
import {NewsService} from "../../services/news.service";
import {Subject, takeUntil} from "rxjs";
import {FormControl} from "@angular/forms";
import {environment} from "../../../environments/environment";
import {InformationService} from "../../services/information.service";
import {HttpErrorResponse} from "@angular/common/http";
import {StorageService} from "../../services/storage.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.less']
})
export class SubscribeComponent implements OnDestroy, OnInit {

  email: string = '';
  name: string = '';

  private destroySubject: Subject<void> = new Subject();

  emailControl = new FormControl('');

  subscribeError: HttpErrorResponse;

  subscribed: boolean = false;

  constructor(
    private newsService: NewsService,
    private informationService: InformationService,
    private storageService: StorageService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {

    this.subscribed = this.storageService.getItem('subscribed', 'false')
  }

  ngOnInit(): void {


  }

  subscribe() {
    this.clearControl();
    if (this.validate()) {
      this.informationService.subscribeNewsletters({
        name: this.name,
        // concent_data_processing: true,
        email: this.email
      }).subscribe((res: any) => {
          this.subscribed = true;
          this.storageService.setItem(true, 'subscribed');
          this.openSnackBar();


        },
        err => {

          this.subscribeError = err;
          this.resolveErrors(err)
        })
    }
  }

  openSnackBar() {
    let snackBarRef = this.snackBar.open('Вы успешно подписались на нашу рассылку', 'Отписаться', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 5000,
    });
    snackBarRef._open();
    snackBarRef.onAction().pipe(
      takeUntil(this.destroySubject),
    ).subscribe((event) =>{
      this.unsubscribe();
    })
  }

  unsubscribe() {
    this.router.navigate(['unsubscribe'], {queryParams: {query: this.email}});

  }

  resolveErrors(httpErrorResponse: HttpErrorResponse) {
    if (!httpErrorResponse) {

      return;
    }
    let errKey = '';
    let errors = httpErrorResponse.error;
    Object.keys(errors).forEach((key) => {

      if (errors[key].toString().includes('exists')) {
        errKey = 'customerExist';


      } else {
        errKey = this.getErrorText(key);
      }

      let error: any = {};
      error[errKey] = true;

      this.emailControl.setErrors(
        error
      );
      this.emailControl.markAsDirty();

    })
  }

  clearControl() {
    this.emailControl.markAsPristine();

  }

  validate(): boolean {
    const emailRegex = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$"
    let isValid = true;

    if (!this.email.match(emailRegex)) {
      this.emailControl.setErrors({emailCorrectError: false});
      this.emailControl.markAsDirty();
      isValid = false;
    }
    return isValid;
  }

  getErrorText(errors: any): string {
    let errorText = '';
    Object.keys(errors).forEach((err) => {
      errorText += environment.errors[err as keyof typeof environment.errors]

    })
    return errorText;
  }

  ngOnDestroy() {
    this.destroySubject.next();
  }


}
