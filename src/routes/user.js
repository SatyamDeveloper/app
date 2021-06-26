const router = require('express').Router()
const User = require('../models/user')
const Admin = require('../models/admin')
const Product = require('../models/product')
const bcrypt = require('bcryptjs')
const { verify, redirect } = require('../middleware/auth')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

const page = (filePath) => {
  return async (req, res) => {
    try {
      const cartQty = req.rootUser?.carts?.length
      const user = req.rootUser
      const websiteDetails = await Admin.findOne({ email: process.env.EMAIL })
      const products = await Product.find().sort({ createdAt: 'desc' })
      res.render(filePath, { user, cartQty, websiteDetails, products })
    } catch (error) {
      console.log(error);
    }
  }
}

router.get('/', verify, page('user/home'))
router.get('/product/:id', verify, async (req, res) => {
  try {
    const cartQty = req.rootUser?.carts?.length
    const user = req.rootUser
    const websiteDetails = await Admin.findOne({ email: process.env.EMAIL })
    const product = await Product.findOne({ _id: req.params.id })
    res.render('user/product', { user, cartQty, websiteDetails, product })
  } catch (error) {
    console.log(error);
  }
})

router.get('/signup', page('user/register'))
router.post('/signup', upload.single("profilePic"), async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body
    const profilePic = req.file.filename;
    if (profilePic && name && mobile && email && password) {
      const userExists = await User.findOne({ email })
      if (!userExists) {
        const userData = await new User({ profilePic, name, mobile, email, password }).save()
        res.status(200).json('User created successfully.')
      } else {
        res.status(400).json('Email already exists.')
      }
    } else {
      res.status(400).json('Please fill all mandatory fields.')
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(`We are unable to create your account. Please try again later.`)
  }
})

router.get('/login', page('user/login'))
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    console.log(email, password);
    if (email && password) {
      const userExists = await User.findOne({ email })
      if (userExists) {
        const passVerify = await bcrypt.compare(password, userExists.password)
        if (passVerify) {
          const token = await userExists.generateToken()
          res.cookie('jwt', token, {
            expires: new Date(Date.now() + 1000000000),
          })
          res.status(200).json('Login successfully.')
        } else {
          res.status(400).json('Invalid Credentials')
        }
      } else {
        res.status(400).json('Invalid Credentials')
      }
    } else {
      res.status(400).json('Please fill all mandatory fileds')
    }
  } catch (error) {
    res.status(500).json('We are unable to login you into your account. Please try again later.')
  }
})

router.get('/logout', redirect, async (req, res) => {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter((currentElem) => {
      return currentElem.token != req.token
    })
    res.clearCookie('jwt')
    await req.rootUser.save()
    res.redirect('/login')
  } catch (error) {
    res.status(500).json('We are unable to logout you from your account. Please try again later.')
  }
})

module.exports = router