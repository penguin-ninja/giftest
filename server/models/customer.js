import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const customerSchema = new Schema({
  firstName: { type: String, required: true, trim: true, default: '' },
  lastName: { type: String, required: true, trim: true, default: '' },
  email: { type: String, default: '' },
  profileImage: { type: String },
  gender: { type: String, enum: ['male', 'female'] },
  fbId: { type: String },
  fbAccessToken: { type: String },
  fbRefreshToken: { type: String },
});

export default mongoose.model('Customer', customerSchema);
