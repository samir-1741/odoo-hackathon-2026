import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { Router } from '@angular/router';

interface Activity {
  id: string;
  name: string;
  time: string;
  cost: number;
}

interface CityPlan {
  id: string;
  name: string;
  activities: Activity[];
}

interface DayPlan {
  day: number;
  date: Date;
  city: string;
  activities: Activity[];
}

@Component({
  selector: 'app-trip-planner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trip-planner.component.html',
  styleUrl: './trip-planner.component.scss'
})
export class TripPlannerComponent {
  bookingService = inject(BookingService);
  router = inject(Router);

  startDate: string = '';
  endDate: string = '';
  
  cities: CityPlan[] = [];
  newCityName: string = '';
  newActivity = { name: '', time: '', cost: 0, cityId: '' };
  viewMode: 'list' | 'calendar' = 'list';
  isSaving = false;
  
  get generatedItinerary(): DayPlan[] {
    if (!this.startDate || this.cities.length === 0) return [];
    
    let itinerary: DayPlan[] = [];
    let start = new Date(this.startDate);
    
    this.cities.forEach((city, index) => {
      let currentDate = new Date(start);
      currentDate.setDate(start.getDate() + index);
      itinerary.push({
        day: index + 1,
        date: currentDate,
        city: city.name,
        activities: [...city.activities]
      });
    });
    
    return itinerary;
  }

  get totalCost(): number {
    return this.cities.reduce((total, city) => {
      return total + city.activities.reduce((sum, act) => sum + act.cost, 0);
    }, 0);
  }

  addCity() {
    if (!this.newCityName.trim()) return;
    this.cities.push({
      id: Date.now().toString(),
      name: this.newCityName,
      activities: []
    });
    this.newCityName = '';
  }

  removeCity(id: string) {
    this.cities = this.cities.filter(c => c.id !== id);
  }

  moveCityUp(index: number) {
    if (index > 0) {
      const temp = this.cities[index];
      this.cities[index] = this.cities[index - 1];
      this.cities[index - 1] = temp;
    }
  }

  moveCityDown(index: number) {
    if (index < this.cities.length - 1) {
      const temp = this.cities[index];
      this.cities[index] = this.cities[index + 1];
      this.cities[index + 1] = temp;
    }
  }

  addActivity(cityId: string) {
    if (!this.newActivity.name || !this.newActivity.time) return;
    const city = this.cities.find(c => c.id === cityId);
    if (city) {
      city.activities.push({
        id: Date.now().toString(),
        name: this.newActivity.name,
        time: this.newActivity.time,
        cost: this.newActivity.cost
      });
      city.activities.sort((a, b) => a.time.localeCompare(b.time));
    }
    this.newActivity = { name: '', time: '', cost: 0, cityId: '' };
  }
  
  removeActivity(cityId: string, activityId: string) {
    const city = this.cities.find(c => c.id === cityId);
    if (city) {
      city.activities = city.activities.filter(a => a.id !== activityId);
    }
  }

  saveTrip() {
    if (!this.startDate || !this.endDate || this.cities.length === 0) {
      alert('Please select dates and add at least one city!');
      return;
    }

    this.isSaving = true;
    const bookingData = {
      destination: this.cities[0].name + (this.cities.length > 1 ? ` & ${this.cities.length - 1} more` : ''),
      start_date: this.startDate,
      end_date: this.endDate,
      total_cost: this.totalCost,
      booking_type: 'package',
      image_url: '/trips/planner_default.jpg',
      details: {
        cities: this.cities.map(c => c.name),
        itinerary: this.generatedItinerary
      }
    };

    this.bookingService.createBooking(bookingData).subscribe({
      next: () => {
        alert('Custom Trip Saved Successfully!');
        this.router.navigate(['/trips']);
      },
      error: (err) => {
        alert('Please login to save your custom trip.');
        this.router.navigate(['/login']);
      },
      complete: () => {
        this.isSaving = false;
      }
    });
  }
}
