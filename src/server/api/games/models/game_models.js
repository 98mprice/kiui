import mongoose from 'mongoose'

const gameSchema = new mongoose.Schema({
  title: {
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
    default: 0,
    min: 0
  },
  character: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset'
  },
  background: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset'
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
})

const Game = mongoose.model('Game', gameSchema)

export default Game
