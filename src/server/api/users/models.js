import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { ServerError } from 'express-server-error'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    require: true,
    minlength: 3
  },
  email: {
    type: String,
    unique: true,
    require: true
  },
  password: {
    type: String,
    require: true,
    minlength: 5
  },
  admin: {
    type: Boolean,
    default: false,
    require: true
  },
  love_list: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  }],
  bookmark_list: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  }],
  review_love_list: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  asset_love_list: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Base_Asset'
  }]
}, {
  timestamps: true
})

const User = mongoose.model('User', userSchema)

userSchema.pre('save', async function (callback) {
  if (!this.isModified('password')) return callback()
  this.password = await bcrypt.hash(this.password, 10)
  callback()
})

userSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new ServerError('User taken.', { status: 409, log: false }))
  }
})

// don't ever return password on creation.
userSchema.set('toJSON', {
  transform (doc, ret, options) {
    delete ret.password
    return ret
  }
})

export default User
