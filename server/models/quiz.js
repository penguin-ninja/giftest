import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const quizSchema = new Schema({
  question: { type: String, required: true },
  slug: { type: String, required: true },
  titleImage: { type: String, required: true },
  resultImage: { type: String, required: true },
  localeData: [{
    lang: String,
    question: String,
    titleImage: String,
  }],
});

export default mongoose.model('Quiz', quizSchema);
