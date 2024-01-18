import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import KeenSlider from "keen-slider";
import {Slide} from "../model/models";
import {inputNames} from "@angular/cdk/schematics";

@Component({
  selector: 'slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.less']
})
export class SliderComponent implements OnDestroy,  OnInit, AfterViewInit {

  @ViewChild("sliderRef") sliderRef: ElementRef<HTMLElement>
  currentSlide: number = 0
  dotHelper: Array<Number> = []
  slider: KeenSlider;

  @Input()
  slidesArray: Slide[] = []
  loaded: boolean[] = [true]

  @Input()
  timeOut: number = 10;

  ngOnInit() {

  }


  ngAfterViewInit(): void {
    this.initSlider();
  }


  initSlider() {
    console.log("***initSlider**** ", this.slidesArray )

    setTimeout(() => {
      this.slider = new KeenSlider(this.sliderRef.nativeElement, {
        initial: 0,
        // mode: "free",
        //
        slideChanged: (s) => {
          this.currentSlide = s.details().relativeSlide
        },

        // animationEnded: (s) => {
        //   const idx = s.track.details.rel
        //   this.loaded[idx] = true
        // },
        loop: true,


      })
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
