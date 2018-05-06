import mongoose from 'mongoose'

const assetsSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  type: {
    type: String,
    require: true,
    enum: [
      'CHARACTER',
      'BACKGROUND',
      'OVERLAY',
      'UI',
      'MUSIC',
      'SOUND_EFFECT'
    ]
  },
  url: {
    type: String,
    require: true
  },
  username: {
    type: String,
    require: true
  },
  love_count: {
    type: Number,
    require: true,
    default: 0
  }
})

const Base_Asset = mongoose.model('Base_Asset', assetsSchema)

export default Base_Asset
