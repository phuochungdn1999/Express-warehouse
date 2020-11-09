const pagination = require('../../../common/helpers/pagination')
const sequelize = require('../../../database/connection')
const { Warehouse } = require('../../../common/models/Warehouse')
const { Product } = require('../../../common/models/Product')
const { History } = require('../../../common/models/History')
const { HistoryType } = require('../../../common/models/HistoryType')
const { UserWarehouse } = require('../../../common/models/UserWarehouse')
const { Category } = require('../../../common/models/Category')
const { NotFoundError, ForbiddenError, BadRequestError } = require('../../../common/errors/http-errors')

const warehouseRepository = require('../../warehouses/repository')
const repository = require('../repository')

async function getAll(req, res) {
  const itemCount = await repository.getCount()
  const options = pagination(req.query, itemCount)

  const products = await repository.getAll({
    include: [{
      model: Warehouse,
      as: 'warehouses',
      attributes: ['id', 'cityId', 'name'],
      through: { attributes: [] }
    }, {
      model: Category,
      as: 'category',
    }],
    ...options
  })
  return res
    .status(200)
    .json({ data: products, ...options })
}

async function getOne(req, res) {
  const product = await repository.getOne(req.params.id, {
    include: [{
      model: Warehouse,
      as: 'warehouses',
      attributes: ['id', 'cityId', 'name'],
      through: { attributes: [] }
    }, {
      model: Category,
      as: 'category',
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    }]
  })
  if (!product) throw new NotFoundError('Product not found')
  return res
    .status(200)
    .json({ data: product })
}

async function getProductInWarehouse(req, res) {
  const itemCount = await repository.getCount({
    include: {
      model: Warehouse,
      as: 'warehouses',
      where: { id: req.params.id },
    }
  })
  const options = pagination(req.query, itemCount)
  const products = await warehouseRepository.getProducts(req.params.id, options)

  return res
    .status(200)
    .json({
      data: products,
      ...options
    })
}

async function createOne(req, res) {
  // authorization
  if (req.body.products.length > 0) {
    const userWarehouse = await UserWarehouse.findOne({
      where: {
        userId: req.user.id,
        warehouseId: req.body.products[0].warehouseId
      }
    })
    if (!userWarehouse) throw new ForbiddenError('Access Forbidden')
  }
  // update product's stock when import/export from warehouse
  const transaction = await sequelize.transaction()

  for (const eachProduct of req.body.products) {
    const { warehouseId, actionType } = eachProduct
    const warehouse = await warehouseRepository.getOne(warehouseId)
    if (!warehouse) throw new BadRequestError('Invalid warehouse')

    let product = await repository.getOneByName(eachProduct.name)
    if (!product) {
      // if user want to export a product not exist, response
      if (actionType === 'EXPORT') 
        throw new BadRequestError('Product not found. Cannot export')
      const warehProd = await 
        createNewProductAndAddRelationship(eachProduct, transaction, warehouse)
      // create history, commit & response
      const history = await createWarehouseHistory(
          actionType,
          warehouse.id,
          `${actionType} amount ${warehProd[0].stock}`
      )
      await createUserHistory(req, transaction, history, req.user.id)
    } else {
        // handle stock when import/export from warehouse
        const warehProd = await 
          updateStock(eachProduct.stock, transaction, warehouse, product, actionType)
        if (!warehProd) 
          throw new BadRequestError('Not enough stock to export')
        // done, create history, commit transaction & response
        const history = await 
          createWarehouseHistory(actionType, warehouse.id, `${actionType} amount ${req.body.stock}`)
        await createUserHistory(req, transaction, history, req.user.id)
      }
    }

    await transaction.commit()
    return res
      .status(200)
      .json({ statusCode: 200 })
}

/**
 * @Usage This function create a new product with data from req param,
 * then create WarehouseProduct middle table between Product & Warehouse and
 * fill with stock prop
 * @param {*} product Request reference
 * @param {*} transaction Transaction reference
 * @param {*} warehouse Warehouse reference to add relation with
 */
async function createNewProductAndAddRelationship(newProduct, transaction, warehouse) {
  try {
    // create product & add relationship to warehouse
    const product = await Product.create(newProduct, {transaction: transaction})
    const warehProd = await warehouse.addProduct(product.id, {
      transaction: transaction,
      through: { stock: newProduct.stock }
    })
    return warehProd
  } catch (error) {
    throw error
  }
}

/**
 * @Usage Find middle record between Warehouse & Product, if not
 * (product is in another warehouse but not this warehouse) => create one.
 * When it found. Update the stock when import/export from warehouse
 * @param {*} stock
 * @param {*} transaction
 * @param {*} warehouse
 * @param {*} product
 * @param {*} actionType
 */
async function updateStock(stock, transaction, warehouse, product, actionType) {
  stock = parseInt(stock, 10)

  // find relationship between warehouse & product
  let warehProd = await WarehouseProduct.findOne({
    where: {
      warehouseId: warehouse.id,
      productId: product.id
    }
  })
  // if warehouse not connected with product, add relationship here
  /** This is used when the system already have the product, but the current warehouse
  doesn't have this product */
  if (!warehProd) {
    warehProd = (await warehouse.addProduct(product.id, {transaction: transaction}))[0]
  }
  // update stock
  if (actionType === 'IMPORT') {
      // console.log('result:', stock)
      warehProd = await warehProd.update({ stock: warehProd.stock + stock }, { transaction: transaction })
  } else if (actionType == 'EXPORT') {
    if (warehProd.stock < stock) 
      return null
    warehProd = await warehProd.update({ stock: warehProd.stock - stock }, {transaction: transaction})
}

  return warehProd
}

async function createUserHistory(req, transaction, history, userId) {
  await history.addUser(userId, { transaction: transaction })
}

async function createWarehouseHistory(actionType, warehouseId, note) {
  const type = await HistoryType.findOne({ where: { name: actionType } })
  return await History.create({typeId: type.id, warehouseId, note})
}

module.exports = {
  getAll,
  getOne,
  getProductInWarehouse,
  createOne,
}
