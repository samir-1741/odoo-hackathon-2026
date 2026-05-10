import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html'
})
export class SettingsComponent {
  
  activeTab = 'Profile';

  // --- Toast Notification System ---
  showToast = false;
  toastMessage = '';

  // --- Dynamic Data Models ---
  profile = {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@nextrip.in',
    phone: '+91 98765 43210',
    avatar: 'https://i.pravatar.cc/150?img=11'
  };

  platform = {
    currency: 'INR',
    language: 'English',
    timezone: 'Asia/Kolkata'
  };

  notifications = {
    newBookings: true,
    cancellations: true,
    payoutAlerts: true,
    marketingEmails: false
  };

  security = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    is2FAEnabled: false
  };

  passwordError = '';

  // --- Methods ---
  
  setTab(tabName: string) {
    this.activeTab = tabName;
    this.passwordError = ''; // Tab change par error clear karein
  }

  // 1. Handle Profile Picture Upload
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profile.avatar = e.target.result; // Real-time image preview change
        this.triggerToast('Profile photo updated successfully!');
      };
      reader.readAsDataURL(file);
    }
  }

  // 2. Toggle 2FA State
  toggle2FA() {
    this.security.is2FAEnabled = !this.security.is2FAEnabled;
    const status = this.security.is2FAEnabled ? 'Enabled' : 'Disabled';
    this.triggerToast(`Two-Factor Authentication ${status}!`);
  }

  // 3. Save Logic with Validation
  saveSettings() {
    if (this.activeTab === 'Security') {
      // Password Validation checks
      if (this.security.newPassword !== this.security.confirmPassword) {
        this.passwordError = 'New password and confirm password do not match!';
        return;
      }
      if (this.security.newPassword && this.security.newPassword.length < 6) {
        this.passwordError = 'Password must be at least 6 characters long!';
        return;
      }
      
      this.passwordError = ''; // Clear error
      
      // Save hone ke baad fields khali kar dein
      this.security.currentPassword = '';
      this.security.newPassword = '';
      this.security.confirmPassword = '';
    }

    this.triggerToast(`${this.activeTab} settings saved successfully!`);
  }

  // 4. Premium Toast Animation Trigger
  triggerToast(message: string) {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000); // 3 seconds baad automatically hide ho jayega
  }
}