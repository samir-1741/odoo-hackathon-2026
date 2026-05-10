const db = require('../config/db');
const asyncHandler = require('express-async-handler');

// @desc    Create a new booking (flight, hotel, package)
// @route   POST /api/bookings
// @access  Private (Needs auth middleware)
exports.createBooking = asyncHandler(async (req, res) => {
    const { destination, start_date, end_date, total_cost, booking_type, details, image_url } = req.body;
    const user_id = req.user.id;

    if (!destination || !start_date || !end_date || !booking_type) {
        res.status(400);
        throw new Error('Please provide destination, start_date, end_date, and booking_type.');
    }

    const [result] = await db.execute(
        'INSERT INTO trips (user_id, destination, start_date, end_date, total_cost, booking_type, details, image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [user_id, destination, start_date, end_date, total_cost || 0, booking_type, JSON.stringify(details || {}), image_url || null, 'Upcoming']
    );

    res.status(201).json({
        id: result.insertId,
        message: 'Booking created successfully'
    });
});

// @desc    Get all user bookings
// @route   GET /api/bookings
// @access  Private
exports.getUserBookings = asyncHandler(async (req, res) => {
    const user_id = req.user.id;

    const [trips] = await db.execute(
        'SELECT * FROM trips WHERE user_id = ? ORDER BY start_date ASC',
        [user_id]
    );

    // Parse the details JSON string back to an object for the frontend
    const formattedTrips = trips.map(trip => {
        let parsedDetails = {};
        try {
            parsedDetails = JSON.parse(trip.details);
        } catch(e) {}
        return {
            ...trip,
            details: parsedDetails
        };
    });

    res.json(formattedTrips);
});

// @desc    Cancel a booking
// @route   DELETE /api/bookings/:id
// @access  Private
exports.cancelBooking = asyncHandler(async (req, res) => {
    const tripId = req.params.id;
    const user_id = req.user.id;

    const [trip] = await db.execute('SELECT id FROM trips WHERE id = ? AND user_id = ?', [tripId, user_id]);
    
    if(trip.length === 0) {
        res.status(404);
        throw new Error('Booking not found or not authorized to cancel');
    }

    await db.execute("UPDATE trips SET status = 'Cancelled' WHERE id = ?", [tripId]);

    res.json({ message: 'Booking cancelled successfully', id: tripId });
});
