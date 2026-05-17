import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  ip: String,
  country: String,
  city: String,
  region: String,
  device: String,
  browser: String,
  os: String,
  page: String,
  referrer: String,
}, { timestamps: true });

export default mongoose.model('Visitor', visitorSchema);