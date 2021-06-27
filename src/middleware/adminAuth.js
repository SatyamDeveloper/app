const jwt = require('jsonwebtoken')
const Admin = require('../models/admin')

const redirect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt
    const verToken = jwt.verify(token, process.env.SECRET_KEY)
    const rootUser = await Admin.findOne({
      _id: verToken._id,
      'tokens.token': token,
    })
    req.token = token
    req.rootUser = rootUser
    next()
  } catch (error) {
    res.redirect('/admin/login')
  }
}

module.exports = redirect