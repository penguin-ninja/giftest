import mongoose from 'mongoose';
import generateSlug from '../utils/generateSlug';

const Schema = mongoose.Schema;

const quizSchema = new Schema({
  question: { type: String, required: true },
  slug: { type: String },
  titleImage: { type: String, required: true },
  resultImage: { type: String, required: true },
  backgroundImage: { type: String, required: true },
  localeData: [{
    lang: String,
    question: String,
    titleImage: String,
  }],
});

quizSchema.pre('save', function (next) { // eslint-disable-line
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
