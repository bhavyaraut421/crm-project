import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String, required: true },
  status: { type: String, default: 'New' },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);
