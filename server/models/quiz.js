import mongoose from 'mongoose';
import generateSlug from '../utils/generateSlug';

const Schema = mongoose.Schema;

const quizSchema = new Schema({
  question: { type: String, required: true },
  slug: { type: String, required: true },
  titleImage: { type: String, required: true },
  resultImage: { type: String, required: true },
  backgroundImage: { type: String, required: true },
  localeData: [{
    lang: String,
    question: String,
    titleImage: String,
  }],
});

quizSchema.pre('save', (next) => {
  generateSlug(this.constructor, this.question)
  .then((slug) => {
    this.slug = slug;
    next();
  })
  .catch((err) => {
    next(err);
  });
});

export default mongoose.model('Quiz', quizSchema);
