const { Product } = require("../../../common/models/Product")

async function getCount() {
  const itemCount = await Product.count()
  return itemCount
}

async function getAll(options) {
  const products = await Product.findAll({
    ...options
  })
  return {
    products
  }
}

async function getOne(id, options) {
  const product = await Product.findOne({ 
    where: { id },
    ...options
  })
  return product
}

module.exports = {
  getCount, 
  getAll,
  getOne
}
