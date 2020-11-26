const { ConflictedError } = require("../../../common/errors/http-errors")
const { Permission } = require("../../../common/models/Permission")

async function getCount(options) {
  const itemCount = await Permission.count(options)
  return itemCount
}

/**
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

async function getOneByName(name) {
  const permission = await Permission.findOne({ 
    where: { permissionName: name },
  })
  return permission
}

async function createOne(body, options) {
  await failIfDuplicated({ permissionName: body.permissionName })
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
  createOne,
}
