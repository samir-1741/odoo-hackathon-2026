import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-place-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './place-detail.component.html',
  styleUrl: './place-detail.component.scss'
})
export class PlaceDetailComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  bookingService = inject(BookingService);
  
  placeName: string = '';
  isScrolled = false;
  activeTab = 'overview';
  isBooking = false;
  
  // Mock detailed data database
  placeData: any = {
    'Paris': {
      name: 'Paris',
      country: 'France',
      heroImage: '/places-intl/paris.jpg',
      rating: 4.9,
      reviews: '128K',
      price: '₹1,20,000',
      duration: '5 Days / 4 Nights',
      description: 'Experience the magic of the City of Light. From the iconic Eiffel Tower to the masterpiece-filled Louvre, Paris offers an unforgettable journey through art, fashion, gastronomy, and culture. Stroll along the Seine, enjoy a croissant at a sidewalk café, and soak in the romantic atmosphere.',
      weather: '15°C',
      bestTimeToVisit: 'Apr - Jun, Sep - Nov',
      attractions: [
        { name: 'Eiffel Tower', image: 'https://images.unsplash.com/photo-1543305113-2d234c22a61b?w=500', type: 'Monument' },
        { name: 'Louvre Museum', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=500', type: 'Art Museum' },
        { name: 'Notre-Dame', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500', type: 'Cathedral' }
      ],
      itinerary: [
        { day: 1, title: 'Arrival & Eiffel Tower', desc: 'Arrive in Paris, settle into your premium hotel, and take an evening cruise on the Seine followed by a visit to the Eiffel Tower.' },
        { day: 2, title: 'Art & History', desc: 'Spend the morning at the Louvre Museum. In the afternoon, wander through the historic Le Marais district.' },
        { day: 3, title: 'Palace of Versailles', desc: 'Take a day trip to the magnificent Palace of Versailles and explore its sprawling gardens.' }
      ]
    },
    'Ladakh': {
      name: 'Leh Ladakh',
      country: 'India',
      heroImage: '/places/ladakh.jpg',
      rating: 4.8,
      reviews: '45K',
      price: '₹45,000',
      duration: '7 Days / 6 Nights',
      description: 'A land like no other with a superabundance of attractions to visit and phantasmagoric and fabulous landscapes, amazing people and culture, Ladakh is truly a heaven on Earth. High altitude desert terrain, crystal clear lakes, and ancient Buddhist monasteries await you.',
      weather: '5°C',
      bestTimeToVisit: 'May - September',
      attractions: [
        { name: 'Pangong Lake', image: 'https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?w=500', type: 'Lake' },
        { name: 'Nubra Valley', image: 'https://images.unsplash.com/photo-1598425237654-4fbab557ee6c?w=500', type: 'Valley' },
        { name: 'Thiksey Monastery', image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=500', type: 'Monastery' }
      ],
      itinerary: [
        { day: 1, title: 'Acclimatization in Leh', desc: 'Arrive in Leh. Rest for the day to acclimatize to the high altitude. Short evening walk in the local market.' },
        { day: 2, title: 'Local Sightseeing', desc: 'Visit Hall of Fame, Magnetic Hill, and Sangam (confluence of Zanskar and Indus rivers).' },
        { day: 3, title: 'Nubra Valley via Khardung La', desc: 'Drive to Nubra Valley crossing the world\'s highest motorable pass. Enjoy the double-humped camel ride.' }
      ]
    }
  };

  currentPlace: any = null;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.placeName = params.get('name') || 'Paris';
      this.loadPlaceData();
    });
  }

  loadPlaceData() {
    if (this.placeData[this.placeName]) {
      this.currentPlace = this.placeData[this.placeName];
    } else {
      this.currentPlace = {
        name: this.placeName,
        country: 'Global Destination',
        heroImage: '/places/' + this.placeName.toLowerCase().replace(/ /g, '') + '.jpg',
        rating: (Math.random() * (5.0 - 4.2) + 4.2).toFixed(1),
        reviews: Math.floor(Math.random() * 50 + 10) + 'K',
        price: '₹' + Math.floor(Math.random() * 90 + 30) + ',000',
        duration: '6 Days / 5 Nights',
        description: `Explore the untouched beauty and rich cultural heritage of ${this.placeName}. Our AI-curated itinerary ensures you experience both the iconic landmarks and hidden local secrets of this incredible destination.`,
        weather: Math.floor(Math.random() * 25 + 10) + '°C',
        bestTimeToVisit: 'Year-round',
        attractions: [
          { name: 'Historic City Center', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500', type: 'Culture' },
          { name: 'Scenic Viewpoint', image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=500', type: 'Nature' }
        ],
        itinerary: [
          { day: 1, title: 'Arrival & Welcome', desc: 'Transfer to your luxury accommodation and enjoy an evening welcome dinner.' }
        ]
      };
      
      const intlPlaces = ['paris', 'tokyo', 'newyork', 'sydney', 'rome', 'santorini', 'dubai', 'bali', 'maldives', 'london'];
      if(intlPlaces.includes(this.placeName.toLowerCase().replace(/ /g, ''))) {
          this.currentPlace.heroImage = '/places-intl/' + this.placeName.toLowerCase().replace(/ /g, '') + '.jpg';
      }
    }
  }

  bookTrip() {
    this.isBooking = true;
    
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() + 1);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 5);

    const bookingData = {
      destination: this.currentPlace.name,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      total_cost: parseFloat(this.currentPlace.price.replace('₹', '').replace(',', '').replace('L', '00000')),
      booking_type: 'package',
      image_url: this.currentPlace.heroImage,
      details: {
        duration: this.currentPlace.duration,
        rating: this.currentPlace.rating
      }
    };

    this.bookingService.createBooking(bookingData).subscribe({
      next: () => {
        alert('Trip Booked Successfully! View it in My Journeys.');
        this.router.navigate(['/trips']);
      },
      error: (err) => {
        alert('Please Login to book your trip!');
        this.router.navigate(['/login']);
      },
      complete: () => {
        this.isBooking = false;
      }
    });
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 100;
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }
}
