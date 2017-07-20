import mongoose from 'mongoose';
import guid from 'guid';
import generateSlug from '../utils/generateSlug';
import uploadS3 from '../utils/uploadS3';
import getBackgroundImage from '../utils/getBackgroundImage';

const Schema = mongoose.Schema;

const quizSchema = new Schema({
  question: {
    type: String,
    required: true,
    set(newVal) {
      this._prevQuestion = this.question;
      return newVal;
    },
  },
  headerText: {
    type: String,
    set(newVal) {
      this._prevHeaderText = this.headerText;
      return newVal;
    },
  },
  bottomText: {
    type: String,
    set(newVal) {
      this._prevBottomText = this.bottomText;
      return newVal;
    },
  },
  slug: { type: String },
  titleImage: { type: String, required: true },
  type: { type: String, enum: ['static', 'soulmate'], default: 'static' },
  algorithm: { type: Number, default: -1 }, // -1 stands for random, from 0 it's index of static image or soulmate
  resultImages: [{
    url: { type: String },
    gender: { type: String, enum: ['male', 'female'] },
  }],
  locale: [{
    language: { type: String },
    question: { type: String },
    headerText: { type: String },
    bottomText: { type: String },
    backgroundImage: { type: String },
    status: { type: String, default: 'created' },
  }],
  translated: { type: Boolean, default: false },
  originalImgConfig: { type: Object },
  resultImgConfig: { type: Object },
  backgroundImage: { type: String },
  status: { type: String, default: 'ACTIVE', enum: ['ACTIVE', 'DISABLED', 'TRANSLATING'] },
});

quizSchema.pre('save', function (next) { // eslint-disable-line
  const bg = getBackgroundImage(this.question || this.headerText, this.bottomText);
  Promise.all([
    generateSlug(this.constructor, this.question),
    uploadS3(bg, guid.raw(), 'jpg', 'image/jpeg'),
  ])
  .then((resp) => {
    const [slug, backgroundImage] = resp;
    this.slug = slug;
    this.backgroundImage = backgroundImage;
    next();
  })
  .catch((err) => {
    next(err);
  });
});

export default mongoose.model('Quiz', quizSchema);
