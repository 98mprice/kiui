import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true
  },
  username: {
    type: String,
    require: true,
    unique: true
  },
  love_count: {
    type: Number,
    require: true,
    default: 0
  },
  score: {
    type: Number,
    require: true
  },
  message: {
    type: String,
    require: true
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  }
}, {
  timestamps: true
})

const Review = mongoose.model('Review', reviewSchema)

export default Review
