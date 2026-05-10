import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  // Check via AuthService (uses 'user' key in localStorage)
  if (authService.isLoggedIn()) {
    return true;
  }
  
  // Not logged in, redirect to login page
  router.navigate(['/login']);
  return false;
};
