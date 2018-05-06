import mongoose from 'mongoose'

const chapterSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true
  },
  position: {
    type: Number,
    require: true,
    unique: true
  },
  contents: {
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

const Chapter = mongoose.model('Chapter', chapterSchema)

export default Chapter
