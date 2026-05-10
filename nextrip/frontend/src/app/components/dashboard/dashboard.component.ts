import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  
  // --- Dummy data for Stats ---
  statCards = [
    { title: 'Total Users', value: '14,290', trend: '+12% this week', isPositive: true },
    { title: 'Active Trips', value: '3,842', trend: '+5% this week', isPositive: true },
    { title: 'Destinations', value: '184', trend: '0% this week', isPositive: true },
    { title: 'Revenue (MTD)', value: '$84.5k', trend: '-2% this week', isPositive: false }
  ];

  // --- Line Chart Data (User Growth) ---
  lineChartData = [
    { month: 'Jan', users: 8000 },
    { month: 'Feb', users: 9500 },
    { month: 'Mar', users: 11200 },
    { month: 'Apr', users: 10500 },
    { month: 'May', users: 13800 },
    { month: 'Jun', users: 14290 }
  ];

  // Dynamically create SVG Path for the Line Chart
  get lineChartPath(): string {
    const maxUsers = 15000;
    const width = 600;
    const height = 150;
    const stepX = width / (this.lineChartData.length - 1);

    let path = '';
    this.lineChartData.forEach((point, index) => {
      const x = index * stepX;
      const y = height - (point.users / maxUsers) * height; // Invert Y axis for SVG
      if (index === 0) {
        path += `M ${x},${y} `;
      } else {
        path += `L ${x},${y} `;
      }
    });
    return path;
  }

  // Get points coordinates for the dots on the line chart
  getChartPoints() {
    const maxUsers = 15000;
    const width = 600;
    const height = 150;
    const stepX = width / (this.lineChartData.length - 1);
    
    return this.lineChartData.map((p, i) => ({
      x: i * stepX,
      y: height - (p.users / maxUsers) * height,
      value: p.users,
      month: p.month
    }));
  }

  // --- Doughnut Chart Data (Trip Distribution) ---
  // Using pure CSS Conic Gradient for the Doughnut
  doughnutGradient = 'conic-gradient(#dc2626 0% 45%, #111827 45% 75%, #e5e7eb 75% 100%)';
  
  doughnutLegend = [
    { label: 'International Trips', percent: '45%', color: 'bg-red-600' },
    { label: 'Domestic Trips', percent: '30%', color: 'bg-gray-900' },
    { label: 'Corporate Bookings', percent: '25%', color: 'bg-gray-200' }
  ];

  // --- Recent Activity ---
  recentActivities = [
    { name: 'Sarah Jenkins', avatar: 'https://i.pravatar.cc/150?img=1', action: 'Created Trip to Paris', date: '2 mins ago', status: 'Active' },
    { name: 'Michael Chen', avatar: 'https://i.pravatar.cc/150?img=2', action: 'Booked Flight to Tokyo', date: '1 hour ago', status: 'Pending' },
    { name: 'Emily Davis', avatar: 'https://i.pravatar.cc/150?img=3', action: 'Updated Payment Method', date: '3 hours ago', status: 'Success' },
    { name: 'James Wilson', avatar: 'https://i.pravatar.cc/150?img=4', action: 'Cancelled Hotel Booking', date: '5 hours ago', status: 'Pending' }
  ];

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active':
      case 'Success':
        return 'bg-green-100 text-green-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }
}