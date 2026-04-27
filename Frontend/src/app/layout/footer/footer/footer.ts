import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface FooterLink {
  label: string;
  path:  string;
}

interface SocialLink {
  label: string;
  href:  string;
  icon:  'instagram' | 'twitter' | 'globe';
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  currentYear = new Date().getFullYear();

  footerLinks: FooterLink[] = [
    { label: 'Privacy Policy',   path: '/privacy'  },
    { label: 'Terms of Service', path: '/terms'    },
    { label: 'Cookie Policy',    path: '/cookies'  },
    { label: 'Contact Us',       path: '/contact'  },
  ];

  socialLinks: SocialLink[] = [
    { label: 'Instagram', href: '#', icon: 'instagram' },
    { label: 'X (Twitter)', href: '#', icon: 'twitter'   },
    { label: 'Website',   href: '#', icon: 'globe'      },
  ];
}