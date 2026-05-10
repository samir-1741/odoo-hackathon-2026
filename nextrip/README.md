# Traveloop - Premium Travel Planning Platform

Traveloop is a modern AI-powered multi-city travel planning platform inspired by MakeMyTrip.

## Getting Started

### 1. Database Setup
1. Create a MySQL database named `traveloop`.
2. Run the `database_schema.sql` file located in the root directory to create the tables.

### 2. Backend Setup
1. Navigate to the `backend` directory.
2. Run `npm install` to install dependencies.
3. Start the server with `npm run dev` (starts on port 5000).

### 3. Frontend Setup
Because execution policies might prevent automatic Angular generation, run the following manually in the root folder:

```bash
npx @angular/cli@19 new frontend --routing=true --style=scss
cd frontend
npm install tailwindcss @tailwindcss/postcss postcss
npx tailwindcss init
npm install @angular/material @angular/cdk primeng chart.js swiper
```

Add Tailwind to your `styles.scss`:
```scss
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Start the frontend:
```bash
npm start
```
