import mongoose from 'mongoose'

const assetsSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    require: true
  },
  type: {
    type: String,
    require: true,
    enum: [
      'CHARACTER'
    ]
  },
  bases: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Base_Asset',
    require: true
  }]
})

const Master_Asset = mongoose.model('Master_Asset', assetsSchema)

export default Master_Asset
