import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  user: any = null;
  avatarUrl: string = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=80'; // fallback hero
  
  isResetModalOpen = false;
  oldPw = '';
  newPw = '';
  errOld = false;
  errNew = false;
  toastMsg = '';
  showToast = false;

  formData = {
    fFirst: '',
    fLast: '',
    fGender: '',
    fDob: '',
    fNationality: 'Indian',
    fMarital: '',
    fAnniversary: '',
    fCity: '',
    fState: '',
    fPassport: '',
    fExpiry: '',
    fIssuing: 'India',
    fPan: '',
    phone: '+91-75578 34291',
    email: 'nextrip.user@gmail.com',
    prefEmail: true,
    prefSms: true,
    prefWa: false
  };

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (user) {
        this.formData.fFirst = user.firstName || '';
        this.formData.fLast = user.lastName || '';
        this.formData.email = user.email || '';
      }
    });
  }

  onAvatarChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const el = document.getElementById('avatarEl');
        if (el) {
          el.style.background = 'none';
          el.innerHTML = `<img src="${e.target.result}" alt="avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />`;
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  saveProfile() {
    this.displayToast('Profile saved successfully!');
  }

  editContact(type: string) {
    if (type === 'phone') {
      const v = prompt('Enter new mobile number:', this.formData.phone);
      if (v && v.trim()) this.formData.phone = v.trim();
    } else {
      const v = prompt('Enter new email:', this.formData.email);
      if (v && v.trim()) this.formData.email = v.trim();
    }
  }

  openResetModal() {
    this.oldPw = '';
    this.newPw = '';
    this.errOld = false;
    this.errNew = false;
    this.isResetModalOpen = true;
  }

  closeResetModal() {
    this.isResetModalOpen = false;
  }

  closeModalBg(event: Event) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeResetModal();
    }
  }

  togglePw(inputId: string, btn: HTMLElement) {
    const inp = document.getElementById(inputId) as HTMLInputElement;
    if (inp) {
      const isText = inp.type === 'text';
      inp.type = isText ? 'password' : 'text';
      const svg = btn.querySelector('svg');
      if (svg) svg.style.opacity = isText ? '1' : '0.4';
    }
  }

  doReset() {
    let ok = true;
    if (!this.oldPw.trim()) { this.errOld = true; ok = false; } else { this.errOld = false; }
    if (this.newPw.trim().length < 8) { this.errNew = true; ok = false; } else { this.errNew = false; }
    
    if (!ok) return;
    this.closeResetModal();
    this.displayToast('Password reset successfully!');
  }

  togglePref(pref: 'prefEmail' | 'prefSms' | 'prefWa') {
    this.formData[pref] = !this.formData[pref];
  }

  displayToast(msg: string) {
    this.toastMsg = msg;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 2800);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
