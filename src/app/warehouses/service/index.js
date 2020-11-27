const pagination = require('../../../common/helpers/pagination')
const { User } = require('../../../common/models/User')
const { Warehouse } = require('../../../common/models/Warehouse')
const { Permission } = require('../../../common/models/Permission')
const sequelize = require('../../../database/connection')

const repository = require('../repository')
const userRepository = require('../../users/repository')
const cityRepository = require('../../cities/repository')

async function getAll(req, res) {
  const itemCount = await repository.getCount()
  const options = pagination(req.query, itemCount)

  const warehouses = await repository.getAll(options)
  return res
    .status(200)
    .json({ data: warehouses })
}

async function getOne(req, res) {
  const warehouse = await repository.getOne(req.params.id)
  if (!warehouse) {
    return res
      .status(404)
      .json({ message: 'Warehouse not found' })
  }
  return res
    .status(200)
    .json({ data: warehouse })
}

async function getOneWithUsers(req, res) {
  const warehouse = await repository.getOneByIdOrFail(req.params.id, {
    include: {
      model: User,
      as: 'users',
      attributes: { exclude: ['password'] },
      through: { attributes: [] }
    }
  })
  
  return res.status(200).json({ data: warehouse })
}

async function getChiefUserOfWarehouse(id) {
  
  const warehouse = await repository.getOne(id, {
    include: {
      model: User,
      as: 'users',
      attributes: { exclude: ['password'] },
      through: { attributes: [] },
      include: {
        model: Permission,
        as: 'permissions',
        through: { attributes: [] },
        where: { permissionName: 'CHIEF_EMPLOYEE' }
      }
    }
  })
  //console.log(warehouse.users)
  return warehouse.users
}

async function getWarehouseByUserId(req, res) {
  const itemCount = await repository.getCount({
    include: { model: User, as: 'users', where: { id: req.user.id } }
  })
  const options = pagination(req.query, itemCount)
  const warehouses = await repository.getAll({
    include: {
      model: User,
      as: 'users',
      where: { id: req.user.id },
      attributes: []
    },
    ...options
  })
  return res.status(200).json({
    data: {
      warehouses,
      ...options
    }
  })
}

async function createOne(req, res) {
  const transaction = await sequelize.transaction()
  const warehouse = await repository.createOne(req.body,{transaction: transaction})

  await transaction.commit()
  return res
    .status(201)
    .json({
      data: warehouse
    })
}

async function applyUserToWarehouse(req, res) {
  const { warehouseId, userId } = req.body
  if (!warehouseId || !userId) {
    return res.status(400).json({ message: 'Missing warehouseId or userId' })
  }
  const warehouse = await repository.getOneByIdOrFail(warehouseId)
  await userRepository.getOneByIdOrFail(userId)

  await warehouse.addUsers(userId)
  return res.status(200).json({ statusCode: 200 })
}

async function updateOne(req, res) {
  await repository.getOneByIdOrFail(req.params.id)
  if (req.body.cityId) await cityRepository.getOneByIdOrFail(req.body.cityId)

  await Warehouse.update(req.body, { where: { id: req.params.id } })
  return res.json({ status: 200 })
}

module.exports = {
  getAll,
  getOne,
  getOneWithUsers,
  getWarehouseByUserId,
  createOne,
  applyUserToWarehouse,
  updateOne,
  getChiefUserOfWarehouse
}
