const { Warehouse } = require("../../../common/models/Warehouse")

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

module.exports = {
  getCount, 
  getAll,
  getOne
}
