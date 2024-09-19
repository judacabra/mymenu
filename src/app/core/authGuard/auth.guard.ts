import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@services/authService/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const authentication = true; /*authService.isTokenExpired();*/

  if(authentication && state.url === '/index'){
    setTimeout(() => {
      router.navigate(['/dashboard']);
    });
  }


  if(!authentication){
    setTimeout(() => {
      authService.isNotAuthorized();
      router.navigate(['/admin']);
    });
    return true;
  }

  return authentication;
};
