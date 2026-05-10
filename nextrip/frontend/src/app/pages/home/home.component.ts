import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  activeTab: string = 'flights';
  tripType: 'national' | 'international' = 'national';
  currentTestimonial = 0;
  testimonialInterval: any;
  parallaxOffset = 0;
  visibleSections = new Set<string>();
  private observer!: IntersectionObserver;

  // Animated counters
  counters = [
    { label: 'Happy Travelers', target: 25000, current: 0, suffix: '+', icon: 'people' },
    { label: 'Destinations', target: 150, current: 0, suffix: '+', icon: 'place' },
    { label: 'Hotels Listed', target: 5000, current: 0, suffix: '+', icon: 'hotel' },
    { label: '5-Star Reviews', target: 12000, current: 0, suffix: '+', icon: 'star' }
  ];

  features = [
    { icon: 'auto_awesome', title: 'AI Trip Planner', description: 'Get personalized itineraries powered by advanced AI that understands your travel style and preferences.', color: 'from-violet-500 to-purple-600' },
    { icon: 'savings', title: 'Best Price Guarantee', description: 'We match or beat any price you find. Save up to 40% on flights and hotels with exclusive member deals.', color: 'from-emerald-500 to-teal-600' },
    { icon: 'support_agent', title: '24/7 Concierge', description: 'Premium support available round the clock. Our travel experts handle everything from changes to emergencies.', color: 'from-orange-500 to-red-600' },
    { icon: 'verified_user', title: 'Secure Booking', description: 'Bank-grade encryption protects your data. Free cancellation on most bookings with instant refund processing.', color: 'from-blue-500 to-cyan-600' }
  ];

  offers = [
    {
      title: 'Domestic Flight Bonanza',
      description: 'Get flat ₹1,500 OFF on your first domestic booking within India',
      code: 'INDIANEXT',
      image: '/offers/domestic.jpg',
      color: 'bg-red-50',
      gradient: 'from-red-500 to-rose-600'
    },
    {
      title: 'International Escape',
      description: 'Flat 15% OFF on flights to Europe & USA',
      code: 'GLOBETROT',
      image: '/offers/international.jpg',
      color: 'bg-blue-50',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Royal Rajasthan',
      description: 'Book 3 nights, Get 1 night free in Jaipur palaces',
      code: 'ROYALINDIA',
      image: '/offers/rajasthan.jpg',
      color: 'bg-amber-50',
      gradient: 'from-amber-500 to-orange-600'
    }
  ];

  nationalDestinations = [
    { name: 'Goa', type: 'Beach', image: '/national/goa.jpg', price: '₹5,999', rating: 4.8, reviews: 2340 },
    { name: 'Jaipur', type: 'Heritage', image: '/national/jaipur.jpg', price: '₹4,499', rating: 4.7, reviews: 1890 },
    { name: 'Manali', type: 'Adventure', image: '/national/manali.jpg', price: '₹3,999', rating: 4.6, reviews: 1560 },
    { name: 'Kerala', type: 'Nature', image: '/national/kerala.jpg', price: '₹7,999', rating: 4.9, reviews: 3120 }
  ];

  internationalDestinations = [
    { name: 'Paris', type: 'City of Love', image: '/international/paris.jpg', price: '₹55,000', rating: 4.9, reviews: 4500 },
    { name: 'Maldives', type: 'Island Luxury', image: '/international/maldives.jpg', price: '₹45,000', rating: 5.0, reviews: 3800 },
    { name: 'Dubai', type: 'Modern Desert', image: '/international/dubai.jpg', price: '₹32,000', rating: 4.8, reviews: 5200 },
    { name: 'Bali', type: 'Tropical Retreat', image: '/international/bali.jpg', price: '₹28,000', rating: 4.7, reviews: 2900 }
  ];

  topPlaces = [
    { name: 'Varanasi',   rank: '01', description: 'Ghats of the sacred Ganga — spiritual capital of India with ancient temples and evening Aarti.',       image: '/places/varanasi.jpg' },
    { name: 'Leh Ladakh', rank: '02', description: 'Pangong Lake & high passes — breathtaking Himalayan landscapes and Buddhist monasteries.',       image: '/places/ladakh.jpg' },
    { name: 'Udaipur',    rank: '03', description: 'Lake Palace & City of Lakes — Venice of the East with royal heritage and sunset boat rides.',      image: '/places/udaipur.jpg' },
    { name: 'Andaman',    rank: '04', description: 'Pristine emerald beach waters — crystal-clear lagoons, coral reefs and tropical paradise.',    image: '/places/andaman.jpg' },
    { name: 'Agra',       rank: '05', description: 'The iconic Taj Mahal — a monument to eternal love and UNESCO World Heritage masterpiece.',             image: '/places/agra.jpg' },
    { name: 'Hampi',      rank: '06', description: 'Ruins of Vijayanagara Empire — boulder-strewn landscapes and ancient temple complexes.',     image: '/places/hampi.jpg' },
    { name: 'Munnar',     rank: '07', description: 'Tea gardens & misty hills — endless rolling green carpets with cool mountain air.',        image: '/places/munnar.jpg' },
    { name: 'Sikkim',     rank: '08', description: 'Kanchenjunga & monasteries — sacred Buddhist land with world\'s third highest peak.',       image: '/places/sikkim.jpg' },
    { name: 'Jaisalmer',  rank: '09', description: 'The Golden Fort of Thar Desert — living fort, camel safaris and starlit desert nights.',  image: '/places/jaisalmer.jpg' },
    { name: 'Rishikesh',  rank: '10', description: 'Yoga capital & holy Ganga — adventure sports meets spiritual awakening.',       image: '/places/rishikesh.jpg' }
  ];

  internationalTopPlaces = [
    { name: 'Paris',      rank: '01', description: 'City of Love — Eiffel Tower, Louvre Museum, Seine River cruises and world-class cuisine.',       image: '/places-intl/paris.jpg' },
    { name: 'Tokyo',      rank: '02', description: 'Ultra-modern meets ancient tradition — cherry blossoms, sushi, neon-lit Shibuya and serene temples.',  image: '/places-intl/tokyo.jpg' },
    { name: 'New York',   rank: '03', description: 'The city that never sleeps — Times Square, Central Park, Statue of Liberty and Broadway magic.',     image: '/places-intl/newyork.jpg' },
    { name: 'Sydney',     rank: '04', description: 'Harbour Bridge, Opera House, Bondi Beach — sun-soaked Australian beauty at every corner.',          image: '/places-intl/sydney.jpg' },
    { name: 'Rome',       rank: '05', description: 'Eternal city of gladiators — Colosseum, Vatican City, Trevi Fountain and authentic Italian pasta.',  image: '/places-intl/rome.jpg' },
    { name: 'Santorini',  rank: '06', description: 'White-washed cliffs over the Aegean Sea — magical sunsets, blue domes and volcanic beaches.',       image: '/places-intl/santorini.jpg' },
    { name: 'Dubai',      rank: '07', description: 'Futuristic desert oasis — Burj Khalifa, desert safaris, gold souks and luxury shopping.',           image: '/places-intl/dubai.jpg' },
    { name: 'Bali',       rank: '08', description: 'Island of the Gods — emerald rice terraces, sacred temples and world-class surfing.',               image: '/places-intl/bali.jpg' },
    { name: 'Maldives',   rank: '09', description: 'Overwater paradise — crystal-clear lagoons, private villas, coral reefs and dolphin encounters.',   image: '/places-intl/maldives.jpg' },
    { name: 'London',     rank: '10', description: 'Royal heritage — Big Ben, Buckingham Palace, Tower Bridge and legendary fish & chips.',              image: '/places-intl/london.jpg' }
  ];

  testimonials = [
    { name: 'Priya Sharma', location: 'Mumbai', avatar: 'P', rating: 5, text: 'Nextrip planned my entire Ladakh trip in minutes! The AI suggested hidden gems I would never have found on my own. Absolute game-changer for solo travelers.', trip: 'Ladakh Adventure' },
    { name: 'Rahul Verma', location: 'Delhi', avatar: 'R', rating: 5, text: 'Booked a family trip to Kerala through Nextrip. The houseboat experience they recommended was magical. Saved over ₹15,000 compared to other platforms!', trip: 'Kerala Backwaters' },
    { name: 'Ananya Patel', location: 'Ahmedabad', avatar: 'A', rating: 5, text: 'The 24/7 concierge service saved my Bali trip when my flight got cancelled. They rebooked everything within an hour. Premium service at its finest!', trip: 'Bali Retreat' },
    { name: 'Vikram Singh', location: 'Jaipur', avatar: 'V', rating: 5, text: 'As a frequent business traveler, Nextrip\'s rewards program is unbeatable. I\'ve already redeemed enough points for a free weekend getaway to Goa!', trip: 'Business + Leisure' }
  ];

  trendingSearches = ['Goa Beaches', 'Manali Snow', 'Kerala Houseboats', 'Rajasthan Forts', 'Andaman Islands', 'Sikkim Monasteries'];

  get currentDestinations() {
    return this.tripType === 'national' ? this.nationalDestinations : this.internationalDestinations;
  }

  get currentTopPlaces() {
    return this.tripType === 'national' ? this.topPlaces : this.internationalTopPlaces;
  }

  ngOnInit() {
    this.startTestimonialCarousel();
  }

  ngAfterViewInit() {
    this.setupIntersectionObserver();
  }

  ngOnDestroy() {
    if (this.testimonialInterval) clearInterval(this.testimonialInterval);
    if (this.observer) this.observer.disconnect();
  }

  @HostListener('window:scroll')
  onScroll() {
    this.parallaxOffset = window.scrollY * 0.3;
  }

  setupIntersectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.visibleSections.add(entry.target.id);
          if (entry.target.id === 'stats-section') {
            this.animateCounters();
          }
        }
      });
    }, { threshold: 0.2 });

    setTimeout(() => {
      document.querySelectorAll('[data-animate]').forEach(el => {
        this.observer.observe(el);
      });
    }, 100);
  }

  animateCounters() {
    this.counters.forEach(counter => {
      if (counter.current > 0) return; // already animated
      const duration = 2000;
      const steps = 60;
      const increment = counter.target / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= counter.target) {
          counter.current = counter.target;
          clearInterval(interval);
        } else {
          counter.current = Math.floor(current);
        }
      }, duration / steps);
    });
  }

  startTestimonialCarousel() {
    this.testimonialInterval = setInterval(() => {
      this.currentTestimonial = (this.currentTestimonial + 1) % this.testimonials.length;
    }, 5000);
  }

  goToTestimonial(index: number) {
    this.currentTestimonial = index;
    if (this.testimonialInterval) clearInterval(this.testimonialInterval);
    this.startTestimonialCarousel();
  }

  setActiveTab(tab: string) { this.activeTab = tab; }
  setTripType(type: 'national' | 'international') { this.tripType = type; }

  isVisible(section: string): boolean {
    return this.visibleSections.has(section);
  }

  copyCode(code: string) {
    navigator.clipboard.writeText(code);
  }

  formatNumber(n: number): string {
    if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'K';
    return n.toString();
  }
}
