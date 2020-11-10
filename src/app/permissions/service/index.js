const repository = require('../repository')
const pagination = require('../../../common/helpers/pagination')
const sequelize = require('../../../database/connection')
const { addDetails } = require('../../../common/models/PermissionDetail')
const { InternalServerError } = require('../../../common/errors/http-errors')

async function getAll(req, res) {
  const itemCount = await repository.getCount()
  const options = pagination(req.query, itemCount)

  const permissions = await repository.getAll(options)
  return res
    .status(200)
    .json({ data: permissions })
}

async function getOne(req, res) {
  const permission = await repository.getOne(req.params.id)
  if (!permission) {
    return res
      .status(404)
      .json({ message: 'Permission not found' })
  }
  return res
    .status(200)
    .json({ data: permission })
}

async function getDetails(req, res) {
  const permission = await repository.getOne(req.params.id)
  if (!permission) {
    return res
      .status(404)
      .json({ statusCode: 404, message: 'Permission not found' })
  }

  const details = await permission.getPermissionDetails({
    attributes: ['actionCode', 'actionName', 'checkAction']
  })
  return res.status(200).json({
    data: details
  })
}

async function createOne(req, res) {
  const transaction = await sequelize.transaction()
  const permission = await repository.createOne(req.body, { transaction: transaction })
  // Add permission details (includes all permission that available in the system)
  await addDetails(permission.id, transaction)

  await transaction.commit()
  return res
    .status(201)
    .json({
      data: permission
    })
}

module.exports = {
  getAll,
  getOne,
  getDetails,
  createOne,
}
