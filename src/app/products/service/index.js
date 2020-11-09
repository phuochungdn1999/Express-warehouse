const pagination = require('../../../common/helpers/pagination')
const { Warehouse } = require('../../../common/models/Warehouse')
const { Category } = require('../../../common/models/Category')
const { NotFoundError } = require('../../../common/errors/http-errors')

const warehouseRepository = require('../../warehouses/repository')
const repository = require('../repository')

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
  if (!product) throw new NotFoundError('Product not found')
  return res
    .status(200)
    .json({ data: product })
}

async function getProductInWarehouse(req, res) {
  const itemCount = await repository.getCount({
    include: {
      model: Warehouse,
      as: 'warehouses',
      where: { id: req.params.id },
    }
  })
  const options = pagination(req.query, itemCount)
  const products = await warehouseRepository.getProducts(req.params.id, options)

  return res
    .status(200)
    .json({
      data: products,
      ...options
    })
}

module.exports = {
  getAll,
  getOne,
  getProductInWarehouse,
}
