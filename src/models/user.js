const mongooose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongooose.Schema({
  profilePic: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  wishlists: [
    {
      wishlist: {
        type: String,
      }
    }
  ],
  orders: [
    {
      order: {
        type: String,
      },
      quantity: {
        type: Number,
      }
    }
  ],
  carts: [
    {
      cart: {
        type: String,
        unique: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    }
  ],
  tokens: [
    {
      token: {
        type: String,
      },
    },
  ],
})

userSchema.methods.generateToken = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id.toString() },
      process.env.SECRET_KEY
    )
    this.tokens = this.tokens.concat({ token })
    await this.save()
    return token
  } catch (error) {
    res.status(500).json(error)
  }
}

userSchema.pre('save', async function (_req, _res, next) {
  try {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 12)
    }
    next()
  } catch (error) {
    res.status(500).json(error)
  }
})

const User = mongooose.model('USER', userSchema)
module.exports = User