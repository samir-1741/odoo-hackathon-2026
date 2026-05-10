import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Form inputs ke liye zaroori hai

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule], // FormsModule yahan add karna mat bhuliyega
  templateUrl: './user-management.component.html'
})
export class UserManagementComponent {
  
  // Modal State
  showAddModal = false;

  // New User Object
  newUser = {
    name: '',
    email: '',
    role: 'Customer',
    status: 'Active'
  };

  // Dummy Users Data
  users = [
    { id: 1, name: 'Rahul Sharma', email: 'rahul.s@example.com', role: 'Customer', status: 'Active', joinDate: '10 May 2026', avatar: 'https://i.pravatar.cc/150?img=11' },
    { id: 2, name: 'Priya Patel', email: 'priya.p@example.com', role: 'Admin', status: 'Active', joinDate: '08 May 2026', avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: 3, name: 'Amit Kumar', email: 'amit.k@example.com', role: 'Customer', status: 'Inactive', joinDate: '02 May 2026', avatar: 'https://i.pravatar.cc/150?img=8' },
    { id: 4, name: 'Neha Singh', email: 'neha.s@example.com', role: 'Agent', status: 'Pending', joinDate: '12 Apr 2026', avatar: 'https://i.pravatar.cc/150?img=9' },
    { id: 5, name: 'Vikram Verma', email: 'vikram.v@example.com', role: 'Customer', status: 'Active', joinDate: '05 Apr 2026', avatar: 'https://i.pravatar.cc/150?img=12' }
  ];

  // --- Modal Controllers ---
  openAddUserModal() {
    // Modal open karte waqt form reset kar dete hain
    this.newUser = { name: '', email: '', role: 'Customer', status: 'Active' };
    this.showAddModal = true;
  }

  closeModal() {
    this.showAddModal = false;
  }

  // --- Add User Action ---
  saveUser() {
    if (!this.newUser.name || !this.newUser.email) {
      alert('Please fill out all required fields.');
      return;
    }

    // Auto-generate ID & Random Avatar
    const newId = this.users.length ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
    const randomAvatar = `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`;
    
    // Current Date formatting (e.g., 10 May 2026)
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    // Naye user ko list mein sabse upar (unshift) add karte hain
    this.users.unshift({
      id: newId,
      name: this.newUser.name,
      email: this.newUser.email,
      role: this.newUser.role,
      status: this.newUser.status,
      joinDate: formattedDate,
      avatar: randomAvatar
    });

    this.closeModal(); // Save hone ke baad popup band kar dein
  }

  // --- Delete User Action ---
  deleteUser(id: number, name: string) {
    // Ek simple confirmation
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      this.users = this.users.filter(user => user.id !== id);
    }
  }

  // --- UI Helpers ---
  getStatusClass(status: string): string {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700 border-green-200';
      case 'Inactive': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getRoleBadge(role: string): string {
    switch (role) {
      case 'Admin': return 'bg-red-50 text-red-600';
      case 'Agent': return 'bg-blue-50 text-blue-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  }
}