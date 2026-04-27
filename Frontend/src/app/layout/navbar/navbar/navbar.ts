import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  template: '<nav><p>Navbar</p></nav>',
  styles: ['nav { background: blue; }']
})
export class NavbarComponent {
}