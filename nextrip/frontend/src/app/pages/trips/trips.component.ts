import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.scss'
})
export class TripsComponent implements OnInit {
  bookingService = inject(BookingService);
  activeFilter: string = 'all';
  expandedTrip: number | null = null;
  isLoading: boolean = true;

  myTrips: any[] = [];

  quickStats = [
    { label: 'Total Trips', value: '0', icon: 'luggage', color: 'from-red-500 to-rose-600' },
    { label: 'Cities Explored', value: '0', icon: 'location_city', color: 'from-blue-500 to-indigo-600' },
    { label: 'Total Spending', value: '₹0', icon: 'account_balance_wallet', color: 'from-emerald-500 to-teal-600' },
    { label: 'Travel Days', value: '0', icon: 'calendar_month', color: 'from-amber-500 to-orange-600' }
  ];

  ngOnInit() {
    this.loadUserTrips();
  }

  loadUserTrips() {
    this.isLoading = true;
    this.bookingService.getBookings().subscribe({
      next: (data) => {
        this.myTrips = data.map(trip => ({
          ...trip,
          title: trip.destination,
          date: `${new Date(trip.start_date).toLocaleDateString()} - ${new Date(trip.end_date).toLocaleDateString()}`,
          budget: `₹${Number(trip.total_cost).toLocaleString()}`,
          image: trip.image_url || '/trips/default.jpg'
        }));
        this.calculateStats();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading trips', err);
        this.isLoading = false;
      }
    });
  }

  calculateStats() {
    const totalCost = this.myTrips.reduce((sum, trip) => sum + Number(trip.total_cost), 0);
    const cities = new Set(this.myTrips.map(t => t.destination)).size;
    
    this.quickStats[0].value = this.myTrips.length.toString();
    this.quickStats[1].value = cities.toString();
    this.quickStats[2].value = totalCost >= 100000 ? `₹${(totalCost / 100000).toFixed(1)}L` : `₹${(totalCost / 1000).toFixed(0)}K`;
    this.quickStats[3].value = (this.myTrips.length * 4).toString(); 
  }

  get filteredTrips() {
    if (this.activeFilter === 'all') return this.myTrips;
    return this.myTrips.filter(t => t.status.toLowerCase() === this.activeFilter.toLowerCase());
  }

  toggleItinerary(tripId: number) {
    this.expandedTrip = this.expandedTrip === tripId ? null : tripId;
  }

  cancelTrip(id: number) {
    if(confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.cancelBooking(id).subscribe(() => {
        this.loadUserTrips();
      });
    }
  }
}
