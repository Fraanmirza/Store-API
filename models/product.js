const mongoose = require("mongoose");
var date = new Date();
const productSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, "product name must be provided"],
  },
  price: {
    type: Number,
    require: [true, "product price must be provided"],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  ratings: {
    type: Number,
    default: 4.5,
  },
  createdAt: {
    type: Date,
    default: date,
  },
  company: {
    type: String,
    enum: {
      values: ["ikea", "liddy", "caressa", "marcos"],
      message: "{VALUE} is not supported.",
    },
    //enum : ['ikea','liddy','caressa','marcos']
  },
});

module.exports = mongoose.model("product", productSchema);
