const jwt = require('jsonwebtoken')
const User = require('../models/user')

const verify = async (req, res, next) => {
  try {
    const token = req.cookies.jwt
    const verToken = jwt.verify(token, process.env.SECRET_KEY)
    const rootUser = await User.findOne({
      _id: verToken._id,
      'tokens.token': token,
    })
    req.token = token
    req.rootUser = rootUser
    next()
  } catch (error) {
    next()
  }
}

const redirect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt
    const verToken = jwt.verify(token, process.env.SECRET_KEY)
    const rootUser = await User.findOne({
      _id: verToken._id,
      'tokens.token': token,
    })
    req.token = token
    req.rootUser = rootUser
    next()
  } catch (error) {
    res.redirect('/login')
  }
}

module.exports = { verify, redirect }
