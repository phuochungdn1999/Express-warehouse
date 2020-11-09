const repository = require('../repository')
const pagination = require('../../../common/helpers/pagination')
const sequelize = require('../../../database/connection')

async function getAll(req, res) {
  const itemCount = await repository.getCount()
  const options = pagination(req.query, itemCount)

  const service = await repository.getAll(options)
  return res
    .status(200)
    .json({ data: service })
}

async function getOne(req, res) {
  const service = await repository.getOne(req.params.id)
  if (!service) {
    return res
      .status(404)
      .json({ message: 'Service not found' })
  }
  return res
    .status(200)
    .json({ data: service })
}
async function createOne(req,res){
  const transaction = await sequelize.transaction()
  const categories = await repository.createOne(req.body,{transaction: transaction})

  await transaction.commit()
  return res
    .status(201)
    .json({
      data: categories
    })
}

module.exports = {
  getAll,
  getOne,
  createOne,
}
