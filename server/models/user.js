import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true, trim: true, default: '' },
  lastName: { type: String, required: true, trim: true, default: '' },
  email: { type: String, default: '' },
  profileImage: { type: String },
  fbAccessToken: { type: String },
  fbRefreshToken: { type: String },
});

export default mongoose.model('User', userSchema);
