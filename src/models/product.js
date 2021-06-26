const mongooose = require('mongoose')
const { nanoid } = require('nanoid')

const productSchema = new mongooose.Schema({
  _id: {
    type: String,
    default: () => nanoid(8).toUpperCase()
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    default: 'Koshigo'
  },
  quantity: {
    type: Number,
    default: '30'
  },
  mrp: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  foodtype: {
    type: String,
    default: 'veg',
  },
  bestbefore: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  bulletpoint: {
    type: Array,
    required: true,
  },
  searchterms: [{
    searchterm: {
      type: String,
    },
  }],
  image: {
    type: String,
    required: true,
  },
  manufacturer: {
    type: String,
    default: 'Satyam Traders'
  },
  length: {
    type: Number,
    required: true,
  },
  breadth: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  dimensiontype: {
    type: String,
    required: true,
  },
  netqty: {
    type: Number,
    required: true,
  },
  qtytype: {
    type: String,
    required: true,
  },
  packer: {
    type: String,
    default: 'Satyam Traders'
  },
  fssai: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    default: 'India',
  },
  reviews: [
    {
      username: {
        type: String,
      },
      review: {
        type: String,
      },
      rating: {
        type: String,
      },
    },
  ],
})


const Product = mongooose.model('PRODUCT', productSchema)
module.exports = Product