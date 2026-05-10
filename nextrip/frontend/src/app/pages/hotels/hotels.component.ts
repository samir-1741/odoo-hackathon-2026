import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hotels.component.html',
  styleUrl: './hotels.component.scss'
})
export class HotelsComponent {
  bookingService = inject(BookingService);
  router = inject(Router);

  selectedCategory: string = 'all';
  sortBy: string = 'recommended';
  isBooking = false;

  hotels = [
    { 
      name: 'Taj Lake Palace', 
      location: 'Udaipur, Rajasthan',
      image: '/hotels/udaipur.jpg',
      rating: 5.0,
      reviews: 4500,
      price: 45000,
      originalPrice: 52000,
      amenities: ['Royal Spa', 'Private Dining', 'Boat Transfer', 'Pool', 'Heritage Tour'],
      category: 'luxury',
      badge: 'Editor\'s Pick',
      description: 'A floating marble palace on Lake Pichola, offering royal heritage experiences with modern luxury.'
    },
    { 
      name: 'The Oberoi Amarvilas', 
      location: 'Agra, Uttar Pradesh',
      image: '/hotels/agra.jpg',
      rating: 4.9,
      reviews: 3200,
      price: 38000,
      originalPrice: 42000,
      amenities: ['Taj Mahal View', 'Luxury Spa', 'Pool', 'Fine Dining', 'Butler Service'],
      category: 'luxury',
      badge: 'Best View',
      description: 'Every room offers unobstructed views of the Taj Mahal, just 600m from this wonder of the world.'
    },
    { 
      name: 'W Goa', 
      location: 'Vagator, Goa',
      image: '/hotels/goa.jpg',
      rating: 4.8,
      reviews: 2100,
      price: 18000,
      originalPrice: 22000,
      amenities: ['Beach Access', 'Nightclub', 'Gym', 'Rooftop Bar', 'Live DJ'],
      category: 'boutique',
      badge: 'Trending',
      description: 'Vibrant beachside retreat blending contemporary design with Goan culture on Vagator cliff.'
    }
  ];

  categories = [
    { key: 'all', label: 'All Hotels', icon: 'hotel' },
    { key: 'luxury', label: 'Luxury', icon: 'diamond' },
    { key: 'boutique', label: 'Boutique', icon: 'villa' }
  ];

  get filteredHotels() {
    let list = this.selectedCategory === 'all' ? [...this.hotels] : this.hotels.filter(h => h.category === this.selectedCategory);
    if (this.sortBy === 'price-low') return list.sort((a, b) => a.price - b.price);
    if (this.sortBy === 'price-high') return list.sort((a, b) => b.price - a.price);
    if (this.sortBy === 'rating') return list.sort((a, b) => b.rating - a.rating);
    return list;
  }

  bookHotel(hotel: any) {
    this.isBooking = true;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 10);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 3);

    const bookingData = {
      destination: hotel.location,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      total_cost: hotel.price,
      booking_type: 'hotel',
      image_url: hotel.image,
      details: {
        hotel_name: hotel.name,
        rating: hotel.rating,
        amenities: hotel.amenities
      }
    };

    this.bookingService.createBooking(bookingData).subscribe({
      next: () => {
        alert(`${hotel.name} Booked Successfully!`);
        this.router.navigate(['/trips']);
      },
      error: (err) => {
        alert('Please Login to book your hotel!');
        this.router.navigate(['/login']);
      },
      complete: () => {
        this.isBooking = false;
      }
    });
  }

  formatPrice(price: number): string {
    return '₹' + price.toLocaleString('en-IN');
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }
}
