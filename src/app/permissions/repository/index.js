const { Permission } = require("../../../common/models/Permission")

async function getCount() {
  const itemCount = await Permission.count()
  return itemCount
}

/**
 * 
 * @param {*} options 
 * Should be paginate options
 */
async function getAll(options) {
  const permissions = await Permission.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    ...options
  })
  return {
    permissions,
    ...options
  }
}

async function getOne(id) {
  const permission = await Permission.findOne({ 
    where: { id },
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  })
  return permission
}

module.exports = {
  getCount, 
  getAll,
  getOne
}
