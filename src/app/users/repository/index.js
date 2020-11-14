const { User } = require("../../../common/models/User")

async function getCount() {
  const itemCount = await User.count()
  return itemCount
}

async function getAll(options) {
  const users = await User.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
    ...options
  })
  return {
    users,
    ...options
  }
}

async function getOne(id) {
  const user = await User.findOne({ 
    where: { id },
    attributes: { exclude: ['createdAt', 'updatedAt', 'password'] }
  })
  return user
}

async function getOneByIdOrFail(id, options) {
  const warehouse = await Warehouse.findOne({ 
    where: { id },
    ...options
  })
  if (!warehouse) throw new NotFoundError('Warehouse not found')
  return warehouse
}

module.exports = {
  getCount, 
  getAll,
  getOne,
  getOneByIdOrFail
}
