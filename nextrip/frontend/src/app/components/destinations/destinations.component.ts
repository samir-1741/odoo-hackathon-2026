import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Ye import form ke liye zaroori hai

@Component({
  selector: 'app-destinations',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- Yahan add kiya gaya hai
  templateUrl: './destinations.component.html'
})
export class DestinationsComponent {
  
  // --- Modal & New Destination State ---
  showAddModal = false;
  
  newDestination = {
    name: '',
    country: '',
    price: '',
    image: '',
    status: 'Active'
  };

  // Har ek destination ke liye unique aur stable Pexels IDs
  destinations = [
    { id: 1, name: 'Paris', country: 'France', bookings: 1240, status: 'Active', price: '₹95,000', image: 'https://images.pexels.com/photos/1530283/pexels-photo-1530283.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { id: 2, name: 'Bali', country: 'Indonesia', bookings: 980, status: 'Active', price: '₹65,000', image: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { id: 3, name: 'Tokyo', country: 'Japan', bookings: 850, status: 'Active', price: '₹1,20,000', image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { id: 4, name: 'Santorini', country: 'Greece', bookings: 620, status: 'Inactive', price: '₹1,10,000', image: 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { id: 5, name: 'Dubai', country: 'UAE', bookings: 1450, status: 'Active', price: '₹55,000', image: 'https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { id: 6, name: 'New York', country: 'USA', bookings: 1100, status: 'Active', price: '₹1,45,000', image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { id: 7, name: 'Rome', country: 'Italy', bookings: 1340, status: 'Active', price: '₹85,000', image: 'https://images.pexels.com/photos/532263/pexels-photo-532263.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { id: 8, name: 'Phuket', country: 'Thailand', bookings: 1890, status: 'Active', price: '₹45,000', image: 'https://images.pexels.com/photos/2444403/pexels-photo-2444403.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { id: 9, name: 'London', country: 'UK', bookings: 1650, status: 'Active', price: '₹1,15,000', image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { id: 10, name: 'Sydney', country: 'Australia', bookings: 920, status: 'Active', price: '₹1,60,000', image: 'https://images.pexels.com/photos/2193300/pexels-photo-2193300.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { id: 11, name: 'Amsterdam', country: 'Netherlands', bookings: 1050, status: 'Inactive', price: '₹90,000', image: 'https://images.pexels.com/photos/2082103/pexels-photo-2082103.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { id: 12, name: 'Swiss Alps', country: 'Switzerland', bookings: 780, status: 'Active', price: '₹1,80,000', image: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=600' }
  ];

  // --- Modal Open/Close Functions ---
  openAddModal() {
    // Form ko empty kar dete hain jab naya popup khule
    this.newDestination = { name: '', country: '', price: '', image: '', status: 'Active' };
    this.showAddModal = true;
  }

  closeModal() {
    this.showAddModal = false;
  }

  // --- Naya Location Save Karne Ka Logic ---
  saveDestination() {
    if (!this.newDestination.name || !this.newDestination.price || !this.newDestination.country) {
      alert('Please fill out Name, Country, and Price fields.');
      return;
    }

    // Default image agar user image link blank chhod de
    const defaultImage = 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=600';
    const imageToSave = this.newDestination.image ? this.newDestination.image : defaultImage;

    // Price me '₹' lagana handle karna
    let finalPrice = this.newDestination.price;
    if (!finalPrice.startsWith('₹')) {
      finalPrice = '₹' + finalPrice;
    }

    // List me naya data add karna (sabse aage / unshift)
    this.destinations.unshift({
      id: this.destinations.length + 1,
      name: this.newDestination.name,
      country: this.newDestination.country,
      bookings: 0, // Naye location par 0 bookings
      status: this.newDestination.status,
      price: finalPrice,
      image: imageToSave
    });

    this.closeModal(); // Save karne ke baad popup band karein
  }

  getStatusClass(status: string): string {
    return status === 'Active' 
      ? 'bg-green-500 text-white border-green-600' 
      : 'bg-gray-500 text-white border-gray-600';
  }

  deleteDestination(id: number, name: string) {
    if (confirm(`Are you sure you want to delete ${name} from destinations?`)) {
      this.destinations = this.destinations.filter(d => d.id !== id);
    }
  }

  handleImageError(event: any) {
    const randomId = Math.floor(Math.random() * 1000);
    event.target.src = `https://picsum.photos/600/400?random=${randomId}`;
  }
}