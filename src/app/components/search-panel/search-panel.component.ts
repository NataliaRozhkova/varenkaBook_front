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
  selector: 'search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.less']
})
export class SearchPanelComponent implements AfterViewInit, OnChanges {

  findStr: string = '';

  @Input()
  show: boolean = true;

  @Output()
  closePanel = new EventEmitter<boolean>();

  findStrControl: FormControl = new FormControl<any>({});
  @ViewChild('search') search: ElementRef;


  constructor(
    private router: Router,
  ) {
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.search.nativeElement.focus();
  }


  find() {
    this.router.navigate(['search'], {queryParams: {query: this.findStr}});
    this.closePanel.emit(false);

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show'].currentValue) {
      setTimeout(() => {
        this.search.nativeElement.focus();
      }, 10)
    }
  }

}
