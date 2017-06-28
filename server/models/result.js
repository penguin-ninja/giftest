import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const resultSchema = new Schema({
  user: { type: Schema.ObjectId, ref: 'User' },
  quiz: { type: Schema.ObjectId, ref: 'Quiz' },
  image: { type: String },
});

export default mongoose.model('Result', resultSchema);
