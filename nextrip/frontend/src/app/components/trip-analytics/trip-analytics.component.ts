import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trip-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-analytics.component.html'
})
export class TripAnalyticsComponent {
  
  // Custom Dropdown State
  isDropdownOpen = false;
  selectedTimeframe = 'Last 7 Days';

  // Current Displayed Data
  stats: any[] = [];
  topDestinations: any[] = [];
  recentTrips: any[] = [];
  chartData: any[] = []; // Naya Chart Data Array

  constructor() {
    // Initialize default data
    this.changeTimeframe('Last 7 Days');
  }

  // --- Working Dropdown Filter & Chart Logic ---
  changeTimeframe(timeframe: string) {
    this.selectedTimeframe = timeframe;
    this.isDropdownOpen = false; // Close dropdown

    if (timeframe === 'Last 7 Days') {
      this.stats = [
        { title: 'Total Bookings', value: '452', trend: '+12%', isPositive: true },
        { title: 'Revenue Generated', value: '$84.5k', trend: '+5.2%', isPositive: true },
        { title: 'Active Trips', value: '124', trend: '+1.4%', isPositive: true },
        { title: 'Cancellation Rate', value: '2.1%', trend: '-0.5%', isPositive: true }
      ];
      this.topDestinations = [
        { name: 'Paris, France', bookings: 120, percentage: 85 },
        { name: 'Bali, Indonesia', bookings: 95, percentage: 70 },
        { name: 'Dubai, UAE', bookings: 80, percentage: 55 }
      ];
      this.recentTrips = [
        { id: 'TRP-8492', user: 'Rahul Sharma', avatar: 'https://i.pravatar.cc/150?img=11', destination: 'Paris, France', date: '15 May - 22 May', amount: '$2,450', status: 'Upcoming' },
        { id: 'TRP-8491', user: 'Priya Patel', avatar: 'https://i.pravatar.cc/150?img=5', destination: 'Bali, Indonesia', date: '01 May - 08 May', amount: '$1,800', status: 'Completed' }
      ];
      // 7 Days Chart Data
      this.setChartData([
        { label: 'Mon', value: 45 }, { label: 'Tue', value: 80 }, { label: 'Wed', value: 65 },
        { label: 'Thu', value: 120 }, { label: 'Fri', value: 90 }, { label: 'Sat', value: 150 }, { label: 'Sun', value: 110 }
      ]);
    } 
    else if (timeframe === 'This Month') {
      this.stats = [
        { title: 'Total Bookings', value: '1,892', trend: '+18%', isPositive: true },
        { title: 'Revenue Generated', value: '$345k', trend: '+12.4%', isPositive: true },
        { title: 'Active Trips', value: '482', trend: '+5.1%', isPositive: true },
        { title: 'Cancellation Rate', value: '3.5%', trend: '+0.2%', isPositive: false }
      ];
      this.topDestinations = [
        { name: 'Paris, France', bookings: 540, percentage: 90 },
        { name: 'Tokyo, Japan', bookings: 410, percentage: 75 },
        { name: 'New York, USA', bookings: 320, percentage: 60 }
      ];
      this.recentTrips = [
        { id: 'TRP-8490', user: 'Amit Kumar', avatar: 'https://i.pravatar.cc/150?img=8', destination: 'Tokyo, Japan', date: '10 Jun - 20 Jun', amount: '$3,200', status: 'Upcoming' },
        { id: 'TRP-8489', user: 'Neha Singh', avatar: 'https://i.pravatar.cc/150?img=9', destination: 'Dubai, UAE', date: '05 May - 10 May', amount: '$1,500', status: 'Cancelled' },
        { id: 'TRP-8488', user: 'Vikram Verma', avatar: 'https://i.pravatar.cc/150?img=12', destination: 'New York, USA', date: '28 Apr - 05 May', amount: '$2,900', status: 'Completed' }
      ];
      // Month Chart Data (By Weeks)
      this.setChartData([
        { label: 'Week 1', value: 350 }, { label: 'Week 2', value: 480 },
        { label: 'Week 3', value: 420 }, { label: 'Week 4', value: 642 }
      ]);
    }
    else if (timeframe === 'This Year') {
      this.stats = [
        { title: 'Total Bookings', value: '24,592', trend: '+24%', isPositive: true },
        { title: 'Revenue Generated', value: '$2.4M', trend: '+18.2%', isPositive: true },
        { title: 'Active Trips', value: '1,284', trend: '+8.4%', isPositive: true },
        { title: 'Cancellation Rate', value: '2.8%', trend: '-1.2%', isPositive: true }
      ];
      this.topDestinations = [
        { name: 'Paris, France', bookings: 4230, percentage: 95 },
        { name: 'Bali, Indonesia', bookings: 3812, percentage: 85 },
        { name: 'Tokyo, Japan', bookings: 2940, percentage: 70 }
      ];
      this.recentTrips = [
        { id: 'TRP-8001', user: 'Rahul Sharma', avatar: 'https://i.pravatar.cc/150?img=11', destination: 'Paris, France', date: '15 Jan - 22 Jan', amount: '$2,450', status: 'Completed' },
        { id: 'TRP-8002', user: 'Priya Patel', avatar: 'https://i.pravatar.cc/150?img=5', destination: 'Bali, Indonesia', date: '01 Feb - 08 Feb', amount: '$1,800', status: 'Completed' },
        { id: 'TRP-8003', user: 'Amit Kumar', avatar: 'https://i.pravatar.cc/150?img=8', destination: 'Tokyo, Japan', date: '10 Mar - 20 Mar', amount: '$3,200', status: 'Completed' }
      ];
      // Year Chart Data (By Months)
      this.setChartData([
        { label: 'Jan', value: 1200 }, { label: 'Feb', value: 1500 }, { label: 'Mar', value: 1100 },
        { label: 'Apr', value: 1800 }, { label: 'May', value: 2400 }, { label: 'Jun', value: 2100 },
        { label: 'Jul', value: 2800 }, { label: 'Aug', value: 3100 }, { label: 'Sep', value: 2600 }
      ]);
    }
  }

  // --- Dynamic Chart Height Calculator ---
  setChartData(data: any[]) {
    const maxVal = Math.max(...data.map(d => d.value)) || 1; // Find highest value
    // Calculate percentage height for each bar (min 5% so zero values still show a tiny bar)
    this.chartData = data.map(d => ({
      ...d,
      heightPercent: Math.max((d.value / maxVal) * 100, 5) 
    }));
  }

  // --- Working CSV Download Logic ---
  downloadReport() {
    const headers = ['Trip ID', 'User Name', 'Destination', 'Dates', 'Amount', 'Status'];
    const rows = this.recentTrips.map(trip => [
      trip.id, trip.user, `"${trip.destination}"`, `"${trip.date}"`, `"${trip.amount}"`, trip.status
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Nextrip_Analytics_${this.selectedTimeframe.replace(/ /g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'Upcoming': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}