const repository = require('../repository')
const userRepository = require('../../users/repository')
const warehouseRepository = require('../../warehouses/repository')
const pagination = require('../../../common/helpers/pagination')
const { Op } = require('sequelize')
const { NotFoundError } = require('../../../common/errors/http-errors')

async function getAll(req, res) {
  const itemCount = await repository.getCount()
  const options = pagination(req.query, itemCount)

  const histories = await repository.getAll(options)
  return res
    .status(200)
    .json({ data: histories })
}

async function getOne(req, res) {
  const history = await repository.getOne(req.params.id)
  if (!history) {
    return res
      .status(404)
      .json({ message: 'History not found' })
  }
  return res
    .status(200)
    .json({ data: history })
}

async function getTypes(req, res) {
  const itemCount = await repository.getCount()
  const options = pagination(req.query, itemCount)

  const types = await repository.getTypes(options)
  return res
    .status(200)
    .json({ data: types })
}

async function getWarehouseHistories(req, res) {
  const warehouse = await warehouseRepository.getOne(req.params.id)
  if (!warehouse) throw new NotFoundError('Warehouse not found')

  const itemCount = await repository.getCount()
  let options = pagination(req.query, itemCount)
  options = {
    ...options,
    where: { warehouseId: req.params.id }
  }

  const histories = await repository.getAll(options)
  return res
    .status(200)
    .json({ data: histories })
}

async function getUserHistories(req, res) {
  const user = await userRepository.getOne(req.params.id)
  if (!user) throw new NotFoundError("User not found")
  const warehouses = await user.getWarehouses()
  if (!warehouses) return res.status(200).json({ data: [] })

  const warehouseIds = await warehouses.map(user => ({ warehouseId: user.id }))

  const itemCount = await repository.getCount()
  let options = pagination(req.query, itemCount)
  options = {
    ...options,
    where: { [Op.or]: warehouseIds }
  }

  const histories = await repository.getAll(options)
  return res
    .status(200)
    .json({ data: histories })
}

module.exports = {
  getAll,
  getOne,
  getTypes,
  getWarehouseHistories,
  getUserHistories,
}
