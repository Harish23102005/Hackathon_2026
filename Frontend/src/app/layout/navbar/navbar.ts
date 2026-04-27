import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  isMenuOpen = false;
  isScrolled  = false;

  navLinks = [
    { label: 'Explore',      path: '/explore'      },
    { label: 'Destinations', path: '/destinations'  },
    { label: 'Trips',        path: '/trips'         },
    { label: 'Support',      path: '/support'       },
  ];

  ngOnInit(): void {
    this.checkScroll();
  }

  ngOnDestroy(): void {}

  @HostListener('window:scroll')
  checkScroll(): void {
    this.isScrolled = window.scrollY > 12;
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 768 && this.isMenuOpen) {
      this.isMenuOpen = false;
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}