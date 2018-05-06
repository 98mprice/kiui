import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true
  },
  chapter: {
    type: Number,
    require: true,
    default: 0
  },
  page: {
    type: Number,
    require: true,
    default: 0
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  }
}, {
  timestamps: true
})

const Comment = mongoose.model('Comment', commentSchema)

export default Comment
