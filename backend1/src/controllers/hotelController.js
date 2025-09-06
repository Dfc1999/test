import * as hotelService from '../services/hotelService.js';
import multer from 'multer';

export const upload = multer({ storage: multer.memoryStorage() });

export const createHotelController = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Se requiere al menos una imagen' });
    }

    const hotel = await hotelService.createHotelService(
      req.body, 
      req.files 
    );

    res.status(201).json(hotel);

  } catch (error) {
    res.status(400).json({ 
      message: error.message || 'Error al crear el hotel' 
    });
  }
};

export const getHotelsController = async (req, res) => {
  try {
    const hotels = await hotelService.getHotels();
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHotelController = async (req, res) => {
  try {
    const hotel = await hotelService.getHotel(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateHotelController = async (req, res) => {
  try {
    const hotel = await hotelService.updateHotelService(req.params.id, req.body);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.json(hotel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteHotelController = async (req, res) => {
  try {
    const hotel = await hotelService.deleteHotelService(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHotelRoomsController = async (req, res) => {
  try {
    const rooms = await hotelService.getHotelRooms(req.params.id);
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addRoomToHotelController = async (req, res) => {
  try {
    const { id } = req.params;
    const roomData = req.body;

    const room = await hotelService.addRoomToHotel(id, roomData);

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchRoomsController = async (req, res) => {
  try {
    const { persons, location, minPrice, maxPrice, checkIn, checkOut } = req.query;

    if (!persons || isNaN(persons) || persons <= 0) {
      return res.status(400).json({ message: 'Número de personas inválido' });
    }

    if ((minPrice && isNaN(minPrice)) || (maxPrice && isNaN(maxPrice))) {
      return res.status(400).json({ message: 'Rango de precios inválido' });
    }

    if (checkIn && isNaN(Date.parse(checkIn))) {
      return res.status(400).json({ message: 'Fecha de checkIn inválida' });
    }
    if (checkOut && isNaN(Date.parse(checkOut))) {
      return res.status(400).json({ message: 'Fecha de checkOut inválida' });
    }

    const results = await hotelService.searchRoomsService({
      persons: Number(persons),
      location,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      checkIn,
      checkOut
    });

    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontraron habitaciones con los filtros proporcionados' });
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};
