import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Router} from "@angular/router";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'find-panel',
  templateUrl: './find-panel.component.html',
  styleUrls: ['./find-panel.component.less']
})
export class FindPanelComponent implements AfterViewInit, OnChanges{

  findStr: string = '';

  @Input()
  show: boolean = true;

  @Output()
  closePanel = new EventEmitter<boolean>();

  findStrControl: FormControl = new FormControl<any>({});
  @ViewChild('search') search: ElementRef  ;


  constructor(
    private router: Router,
  ) {
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.search.nativeElement.focus();
  }


  find($event: any){

    this.router.navigate(['product-info', $event.id ])

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("--------  ", changes)
    if (changes['show'].currentValue) {
      setTimeout(() => {
        this.search.nativeElement.focus();

      }, 10)
    }
  }

  }
