const router = require('express').Router()
const Admin = require('../models/admin')
const Product = require('../models/product')

const redirect = require('../middleware/adminAuth')

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
    const websiteDetails = await Admin.findOne({ email: process.env.EMAIL })
    res.render(filePath, { websiteDetails })
  }
}
router.get('/', redirect, page('admin/home'))

router.get('/product/new', redirect, (req, res) => {
  res.render('admin/product', { product: new Product() })
})

router.get('/product/edit/:id', async (req, res) => {
  const product = await Product.findById(req.params.id)
  res.render('admin/product', { product: product })
})


router.post('/product/add', upload.single("image"), async (req, res) => {
  try {
    const { title, mrp, price, size, bestbefore, description, bulletpoint, searchterm, length, breadth, height, dimensiontype, netqty, qtytype, fssai } = req.body
    const searchterms = searchterm.split(',')
    const image = req.file.filename;
    const productData = new Product({
      title, mrp, price, size, bestbefore, description, bulletpoint, image, length, breadth, height, dimensiontype, netqty, qtytype, fssai
    })

    for (let i = 0; i < searchterms.length; i++) {
      productData.searchterms = productData.searchterms.concat({ searchterm: searchterms[i] })
    }

    await productData.save()
    res.redirect('/')
  } catch (error) {
    console.log(error);
    res.render('admin/product', { product: req.body })
  }
})

router.get('/login', page('admin/login'))
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    console.log(email, password);
    if (email && password) {
      const userExists = await Admin.findOne({ email })
      if (userExists) {
        if (password === userExists.password) {
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