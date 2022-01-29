import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'prettier-poc';
  test: Array<string> = [''];
  test2: string[] = [''];

  constructor() {}
}
