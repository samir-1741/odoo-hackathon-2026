import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flights.component.html',
  styleUrl: './flights.component.scss'
})
export class FlightsComponent {
  bookingService = inject(BookingService);
  router = inject(Router);
  
  sortBy: string = 'price';
  selectedStops: string[] = [];
  priceRange = 10000;
  viewMode: 'list' | 'grid' = 'list';
  isBooking = false;

  flights = [
    { 
      airline: 'IndiGo', 
      code: '6E-2142',
      logo: '✈️',
      departure: '06:15 AM', 
      arrival: '08:30 AM', 
      duration: '2h 15m',
      price: 4500,
      originalPrice: 5200,
      type: 'Non-stop',
      class: 'Economy',
      baggage: '15 kg',
      meals: false,
      refundable: false,
      seats: 4
    },
    { 
      airline: 'Air India', 
      code: 'AI-805',
      logo: '🛫',
      departure: '02:00 PM', 
      arrival: '04:15 PM', 
      duration: '2h 15m',
      price: 5200,
      originalPrice: 6000,
      type: 'Non-stop',
      class: 'Economy',
      baggage: '25 kg',
      meals: true,
      refundable: true,
      seats: 12
    },
    { 
      airline: 'Vistara', 
      code: 'UK-945',
      logo: '🌟',
      departure: '08:45 PM', 
      arrival: '11:00 PM', 
      duration: '2h 15m',
      price: 6800,
      originalPrice: 7500,
      type: 'Non-stop',
      class: 'Premium Economy',
      baggage: '25 kg',
      meals: true,
      refundable: true,
      seats: 8
    }
  ];

  get filteredFlights() {
    let result = [...this.flights];
    if (this.selectedStops.length > 0) {
      result = result.filter(f => this.selectedStops.includes(f.type));
    }
    result = result.filter(f => f.price <= this.priceRange);
    if (this.sortBy === 'price') {
      result.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'duration') {
      result.sort((a, b) => a.duration.localeCompare(b.duration));
    }
    return result;
  }

  bookFlight(flight: any) {
    this.isBooking = true;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 7);
    const endDate = new Date(startDate);

    const bookingData = {
      destination: `Flight to ${flight.airline} (${flight.code})`,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      total_cost: flight.price,
      booking_type: 'flight',
      image_url: '/trips/flight_default.jpg',
      details: {
        airline: flight.airline,
        flight_number: flight.code,
        departure: flight.departure,
        arrival: flight.arrival,
        class: flight.class
      }
    };

    this.bookingService.createBooking(bookingData).subscribe({
      next: () => {
        alert(`Flight ${flight.code} Booked Successfully!`);
        this.router.navigate(['/trips']);
      },
      error: (err) => {
        alert('Please Login to book your flight!');
        this.router.navigate(['/login']);
      },
      complete: () => {
        this.isBooking = false;
      }
    });
  }

  toggleStop(stop: string) {
    const index = this.selectedStops.indexOf(stop);
    if (index === -1) {
      this.selectedStops.push(stop);
    } else {
      this.selectedStops.splice(index, 1);
    }
  }
}
