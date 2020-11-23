const repository = require('../repository')
const pagination = require('../../../common/helpers/pagination')
const sequelize = require('../../../database/connection')
const { City } = require('../../../common/models/City')

async function getAll(req, res) {
  const itemCount = await repository.getCount()
  const options = pagination(req.query, itemCount)

  const histories = await repository.getAll(options)
  return res
    .status(200)
    .json({ data: histories })
}

async function getOne(req, res) {
  const city = await repository.getOne(req.params.id)
  if (!city) {
    return res
      .status(404)
      .json({ message: 'City not found' })
  }
  return res
    .status(200)
    .json({ data: city })
}

async function getWarehousesInCity(req,res){
  const city = await repository.getWarehousesInCity(req.params.id)
  if (!city) {
    return res
      .status(404)
      .json({ message: 'City not found' })
  }
  return res
    .status(200)
    .json({ data: city })
}
async function createOne(req, res) {
  const transaction = await sequelize.transaction()
  const city = await repository.createOne(req.body,{transaction: transaction})

  await transaction.commit()
  return res
    .status(201)
    .json({
      data: city
    })
}

async function updateOne(req, res) {
  
  await City.update(req.body, { where: { id: req.params.id } })
  return res.json({ status: 200 })
}

module.exports = {
  getAll,
  getOne,
  getWarehousesInCity,
  createOne,
  updateOne
}
