const { Warehouse } = require("../../../common/models/Warehouse")
const { NotFoundError } = require('../../..//common/errors/http-errors')

async function getCount() {
  const itemCount = await Warehouse.count()
  return itemCount
}

async function getAll(options) {
  const warehouses = await Warehouse.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    ...options
  })
  return {
    warehouses,
    ...options
  }
}

async function getOne(id) {
  const warehouse = await Warehouse.findOne({ 
    where: { id },
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  })
  return warehouse
}

async function getOneByIdOrFail(id, options) {
  const warehouse = await Warehouse.findOne({ 
    where: { id },
    ...options
  })
  if (!warehouse) throw new NotFoundError('Warehouse not found')
  return warehouse
}

/**
 * @param {*} id
 * Warehouse id 
 */
async function getProducts(id, options) {
  const warehouse = await getOneByIdOrFail(id)
  return warehouse.getProducts(options)
}

module.exports = {
  getCount, 
  getAll,
  getOne,
  getOneByIdOrFail,
  getProducts,
}
