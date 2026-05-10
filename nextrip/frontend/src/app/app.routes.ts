import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { FlightsComponent } from './pages/flights/flights.component';
import { HotelsComponent } from './pages/hotels/hotels.component';
import { TripsComponent } from './pages/trips/trips.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PlaceDetailComponent } from './pages/place-detail/place-detail.component';
import { TripPlannerComponent } from './pages/trip-planner/trip-planner.component';
import { authGuard } from './guards/auth.guard';
// Admin Components
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { TripAnalyticsComponent } from './components/trip-analytics/trip-analytics.component';
import { DestinationsComponent } from './components/destinations/destinations.component';
import { FinancialsComponent } from './components/financials/financials.component';
import { SettingsComponent } from './components/settings/settings.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'flights', component: FlightsComponent },
    { path: 'hotels', component: HotelsComponent },
    { path: 'trips', component: TripsComponent, canActivate: [authGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
    { path: 'place/:name', component: PlaceDetailComponent },
    { path: 'plan-trip', component: TripPlannerComponent, canActivate: [authGuard] },
 // Admin Panel route configuration
    { 
       path: 'admin', 
        component: AdminLayoutComponent,
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'users', component: UserManagementComponent },
            { path: 'analytics', component: TripAnalyticsComponent }, 
            { path: 'destinations', component: DestinationsComponent },
            { path: 'financials', component: FinancialsComponent },
            // YAHAN SETTINGS ROUTE ADD KIYA HAI
            { path: 'settings', component: SettingsComponent },
            
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: '' }
];
