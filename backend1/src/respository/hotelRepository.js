import Hotel from '../models/hotel.js'
import Room from '../models/room.js'
import Booking from '../models/booking.js';
import { filterRoomsByLocation, filterHotelsByCapacity, groupRoomsByHotel } from '../utils/filterBuilder.js';

export const createHotel = async (hotelData) => {
  const hotel = new Hotel({
    ...hotelData,
    images: hotelData.images || []
  });
  return await hotel.save();
};

export const getAllHotels = async () => {
  return await Hotel.find().populate('rooms');
};

export const getHotelById = async (id) => {
  return await Hotel.findById(id).populate('rooms');
};

export const updateHotel = async (id, updateData) => {
  return await Hotel.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteHotel = async (id) => {
  return await Hotel.findByIdAndDelete(id);
};

export const getRoomsByHotelId = async (hotelId) => {
  return await Room.find({ hotelId, available: { $gt: 0 } });
};

const buildRoomQuery = (minPrice, maxPrice) => {
  const query = { available: { $gt: 0 }, price: {} }; 
  if (!isNaN(minPrice)) query.price.$gte = minPrice;
  if (!isNaN(maxPrice)) query.price.$lte = maxPrice;
  if (Object.keys(query.price).length === 0) delete query.price;
  return query;
};

export const searchRooms = async ({ persons, location, minPrice, maxPrice, checkIn, checkOut }) => {
  const roomQuery = buildRoomQuery(minPrice, maxPrice);

  let rooms = await Room.find(roomQuery).populate('hotelId');

  rooms = filterRoomsByLocation(rooms, location);

  if (checkIn && checkOut) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const bookings = await Booking.find({
      "rooms.roomId": { $in: rooms.map(r => r._id) },
      status: 'confirmed',
      $or: [
        { checkInDate: { $lt: checkOutDate }, checkOutDate: { $gt: checkInDate } }
      ]
    });

    const bookedRoomIds = new Set(
      bookings.flatMap(b => b.rooms.map(r => r.roomId.toString()))
    );
    
    rooms = rooms.filter(r => !bookedRoomIds.has(r._id.toString()));
  }

  const groupedRooms = groupRoomsByHotel(rooms);

  return filterHotelsByCapacity(groupedRooms, persons);
};
