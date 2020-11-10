const { NotFoundError } = require("../../../common/errors/http-errors")
const { Product } = require("../../../common/models/Product")

async function getCount(options) {
  const itemCount = await Product.count(options)
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

async function getOneByName(name) {
  return await Product.findOne({ where: { name } })
}

async function getOneByIdOrFail(id, options) {
  const product = await Product.findOne({ 
    where: { id },
    ...options
  })
  if (!product) throw new NotFoundError('Product not found')
  return product
}

async function createOne(body, options) {
  return Permission.create(body, options)
}

async function failIfDuplicated(condition) {
  const count = await getCount({ where: condition })
  if (count > 0) throw new ConflictedError('Duplicated')
}

module.exports = {
  getCount, 
  getAll,
  getOne,
  getOneByName,
  getOneByIdOrFail,
  createOne
}
