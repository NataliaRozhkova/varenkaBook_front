import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NewsService} from "../../services/news.service";
import {map, Subject, switchMap, takeUntil} from "rxjs";
import {FormControl} from "@angular/forms";
import {environment} from "../../../environments/environment";
import {InformationService} from "../../services/information.service";
import {HttpErrorResponse} from "@angular/common/http";
import {StorageService} from "../../services/storage.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.less']
})
export class UnsubscribeComponent implements OnDestroy, OnInit {

  email: string = '';
  name: string = '';
  customerId: string;

  private destroySubject: Subject<void> = new Subject();

  emailControl = new FormControl('');

  subscribeError: HttpErrorResponse;

  subscribed: boolean = false;

  constructor(
    private newsService: NewsService,
    private informationService: InformationService,
    private storageService: StorageService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,

  ) {

    this.subscribed = this.storageService.getItem('subscribed', 'false')
  }

  ngOnInit(): void {
    this.route.queryParams?.pipe(
      takeUntil(this.destroySubject),
      switchMap((params: any) => {
        this.email = params.query;
        return this.informationService.getCustomerInfo({email: params.query})
      }),
      map((response: any) => {
        this.name = response.name;
        this.customerId = response.id;
      })
    ).subscribe();
  }

  unsubscribe() {
    this.informationService.unsubscribeNewsletters(this.customerId, {
      concent_data_processing: false,
    }).subscribe((res: any) => {
        this.subscribed = true;
        this.storageService.deleteItem('subscribed');
        this.router.navigate(['main']);
        this.openSnackBar();


      },
      err => {

        this.subscribeError = err;
        this.getErrorText(err)
      })
  }

  openSnackBar() {
    this.snackBar.open('Вы успешно отписались от нашей рассылки', '', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 5000,

    });
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
