import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public HScrolled: boolean;
  constructor() {}

  ngOnInit() {

    const pane = (<any>document.getElementsByClassName('pane')[0]);
          pane.style.transform = `translateY(${135}px)`;

    let steps = [];
    let startP;
    document.getElementsByClassName('draggable')[0]
    .addEventListener('touchstart', (t) => {
      startP = (<any>t).touches[0].screenY;
      steps.push(startP);
    });

    document.getElementsByClassName('draggable')[0]
    .addEventListener('touchend', (t) => {
      steps = [];
    });

    document.getElementsByClassName('draggable')[0]
    .addEventListener('touchmove', (t) => {
      const n = (<any>t).touches[0].screenY;
      let diff = n - steps[steps.length - 1];
      steps.push(n);

      console.log(diff);
      let translateYRegex = /\.*translateY\((.*)px\)/i;
      let p = parseFloat(translateYRegex.exec(pane.style.transform)[1]);
      pane.style.transform = `translateY(${(p + diff)}px)`;
      t.preventDefault();
    });
  }
}
