import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import KeenSlider from "keen-slider";
import {Slide} from "../../model/models";

@Component({
  selector: 'slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.less',
    "../../../../node_modules/keen-slider/keen-slider.min.css",
  ]
})
export class SliderComponent implements OnDestroy,  OnInit, AfterViewInit {

  @ViewChild("sliderRef") sliderRef: ElementRef<HTMLElement>
  currentSlide: number = 0
  dotHelper: Array<Number> = []
  slider: KeenSlider;

  @Input()
  slidesArray: Slide[] = []
  loaded: boolean[] = [true]
  hideSlider: boolean = true;

  @Input()
  timeOut: number = 10;

  ngOnInit() {
    window.dispatchEvent(new Event('resize'));
    // this.initSlider();
    // this.hideSlider = false;

  }


  ngAfterViewInit(): void {
    this.initSlider();
    // this.hideSlider = false;

  }


  initSlider() {
    console.log("***initSlider**** ", this.slidesArray )

    setTimeout(() => {
      this.slider = new KeenSlider(this.sliderRef.nativeElement, {
        initial: 0,
        mode: "snap",

        slideChanged: (s) => {
          this.currentSlide = s.details().relativeSlide
        },
        loop: true,

      });
      console.log("***********   this.initSlides ",   this.hideSlider)
      this.dotHelper = [...Array(this.slider.details().size).keys()]

    }, this.timeOut)
  }

  ngOnDestroy() {
    if (this.slider) this.slider.destroy()
  }

  refresh() {
    console.log("***ss**** ", this.dotHelper)
    this.slider.destroy()
    this.currentSlide = 0;
    this.slider.refresh()
    // this.initSlider()
    console.log("****ss*** ", this.dotHelper)
  }




}
