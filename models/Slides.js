const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Slides = new Schema({
  regId: Schema.ObjectId,
  position: Number,
  text: String,
  img: String,
  video: String,
});

Slides.index({ regId: 1 });

module.exports = mongoose.model('slides', Slides);