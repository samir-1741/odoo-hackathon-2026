import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent {
  isSidebarCollapsed = false;
  
  // Router inject kiya taaki current URL pata chal sake
  private router = inject(Router);

  // Ab active: true/false yahan se hata diya hai
  menuItems = [
    { name: 'Dashboard', route: '/admin/dashboard' },
    { name: 'User Management', route: '/admin/users' },
    { name: 'Trip Analytics', route: '/admin/analytics' },
    { name: 'Destinations', route: '/admin/destinations' },
    { name: 'Financials', route: '/admin/financials' },
    { name: 'Settings', route: '/admin/settings' }
  ];

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  // Ye function automatically check karega ki kaunsa menu active hona chahiye
  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }
}