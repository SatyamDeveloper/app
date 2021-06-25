const mongooose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const adminSchema = new mongooose.Schema({
  email: {
    type: String,
    default: 'satyam20112006@gmail.com'
  },
  password: {
    type: String,
    default: 'Satyam11',
  },
  banners: [{
    banner: {
      type: String,
    }
  }],
  categories: [{
    Pic: {
      type: String,
    },
    name: {
      type: String
    }
  }],
  tokens: [
    {
      token: {
        type: String,
      },
    },
  ],
})

adminSchema.methods.generateToken = async function () {
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

const Admin = mongooose.model('ADMIN', adminSchema)
module.exports = Admin