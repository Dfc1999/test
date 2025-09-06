import * as bookingRepository from '../respository/bookingRepository.js';
import * as roomRepository from '../respository/roomRepository.js';

export const createBookingService = async (bookingData) => {
  if (!bookingData.rooms || bookingData.rooms.length === 0) {
    throw new Error('You must select at least one room type');
  }

  const checkIn = new Date(bookingData.checkInDate);
  const checkOut = new Date(bookingData.checkOutDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  if (checkIn < today) {
    throw new Error('Check-in date cannot be in the past');
  }
  if (checkOut <= checkIn) {
    throw new Error('Check-out date must be after check-in date');
  }

  let totalPrice = 0;

  for (const item of bookingData.rooms) {
    const room = await roomRepository.getRoomById(item.roomId);
    if (!room) throw new Error(`Room ${item.roomId} not found`);
    if (room.available < item.quantity) {
      throw new Error(`Not enough rooms available for ${room.name}`);
    }

    await roomRepository.updateRoom(room._id, { available: room.available - item.quantity });

    const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    totalPrice += days * room.price * item.quantity;

    bookingData.hotelId = room.hotelId;
  }

  bookingData.totalPrice = totalPrice;
  bookingData.guests = bookingData.rooms.reduce((sum, r) => sum + r.quantity, 0);

  const booking = await bookingRepository.createBooking(bookingData);

  return booking;
};

export const getBooking = async (id) => {
  return await bookingRepository.getBookingById(id);
};

export const getBookingsByUser = async (guestId = null) => {
  if (guestId) {
    return await bookingRepository.getBookingsByGuest(guestId);
  }
  return await bookingRepository.getAllBookings();
};

export const updateBookingService = async (id, updateData) => {
  return await bookingRepository.updateBooking(id, updateData);
};

export const cancelBookingService = async (id) => {
  const booking = await bookingRepository.getBookingById(id);
  if (!booking) throw new Error('Booking not found');

  const now = new Date();
  const checkInDate = new Date(booking.checkInDate);
  const daysBefore = (checkInDate - now) / (1000 * 60 * 60 * 24);

  if (daysBefore < 3) {
    throw new Error('Cancellation not allowed less than 3 days before check-in');
  }

  const cancelledBooking = await bookingRepository.cancelBooking(id);

  for (const item of cancelledBooking.rooms) {
    const room = await roomRepository.getRoomById(item.roomId);
    if (room) {
      await roomRepository.updateRoom(room._id, { 
        available: room.available + item.quantity 
      });
    }
  }

  return cancelledBooking;
};

