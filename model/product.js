const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        Required: true
    },
  description:{
    type: String,
    Required: true
  },
  price:{
    type: Number,
    Required: true
  },
  stock:{
    type: String,
    Required: true,
    default:1
  },
  rating:{
    type: String,
    default:0,
    Required: true
  },
  image: {

    public_id: {
        type: String,
        Required: true,
    },

    url: {
        type: String,
        Required: true,
    },

},
catrgory:{
    type: String,
    Required: true,
}

   
}, { timestamps: true })
const ProductModel = mongoose.model('Product', ProductSchema)

module.exports = ProductModel