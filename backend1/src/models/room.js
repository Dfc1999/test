import mongoose from 'mongoose';

/**
 * *Defines the structure for hotel rooms including type, capacity, price, and availability
 */
const roomSchema = new mongoose.Schema({
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  type: { 
    type: String, 
    enum: ['single', 'double', 'triple', 'suite'], 
    required: true 
  },
  beds: { type: Number, required: true },
  capacity: { type: Number, required: true },
  price: { type: Number, required: true },

  quantity: { type: Number, required: true, default: 1 },

  available: { type: Number, default: function () { return this.quantity; } },

  description: { type: String },
  features: { type: String }
});


export default mongoose.model('Room', roomSchema);