const { Warehouse } = require("../../../common/models/Warehouse")
const { NotFoundError,ConflictedError } = require('../../..//common/errors/http-errors')

async function getCount(options) {
  const itemCount = await Warehouse.count(options)
  return itemCount
}

async function getAll(options) {
  const warehouses = await Warehouse.findAll({
    ...options
  })
  return {
    warehouses
  }
}

async function getOne(id, options) {
  const warehouse = await Warehouse.findOne({ 
    where: { id },
    ...options
  })
  return warehouse
}

async function getOneByIdOrFail(id, options) {
  const warehouse = await Warehouse.findOne({ 
    where: {id},
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

async function createOne(body, options) {
  await failIfDuplicated({ name: body.name })
  return Warehouse.create(body, options)
}

async function failIfDuplicated(condition) {
  const count = await getCount({ where: condition })
  console.log('count',count)
  if (count > 0) throw new ConflictedError('Duplicated')
}

module.exports = {
  getCount, 
  getAll,
  getOne,
  getOneByIdOrFail,
  getProducts,
  createOne
}
