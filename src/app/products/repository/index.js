const { Product } = require("../../../common/models/Product")

async function getCount() {
  const itemCount = await Product.count()
  return itemCount
}

async function getAll(options) {
  const products = await Product.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    ...options
  })
  return {
    products,
    ...options
  }
}

async function getOne(id) {
  const product = await Product.findOne({ 
    where: { id },
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  })
  return product
}

module.exports = {
  getCount, 
  getAll,
  getOne
}
