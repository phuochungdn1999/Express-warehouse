const repository = require('../repository')
const pagination = require('../../../common/helpers/pagination')
const { Warehouse } = require('../../../common/models/Warehouse')
const { Category } = require('../../../common/models/Category')

async function getAll(req, res) {
  const itemCount = await repository.getCount()
  const options = pagination(req.query, itemCount)

  const products = await repository.getAll({
    include: [{
      model: Warehouse,
      as: 'warehouses',
      attributes: ['id', 'cityId', 'name'],
      through: { attributes: [] }
    }, {
      model: Category,
      as: 'category',
    }],
    ...options
  })
  return res
    .status(200)
    .json({ data: products, ...options })
}

async function getOne(req, res) {
  const product = await repository.getOne(req.params.id, {
    include: [{
      model: Warehouse,
      as: 'warehouses',
      attributes: ['id', 'cityId', 'name'],
      through: { attributes: [] }
    }, {
      model: Category,
      as: 'category',
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    }]
  })
  if (!product) {
    return res
      .status(404)
      .json({ message: 'Product not found' })
  }
  return res
    .status(200)
    .json({ data: product })
}

module.exports = {
  getAll,
  getOne
}
