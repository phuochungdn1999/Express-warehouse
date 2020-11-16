const repository = require('../repository')
const { Product } = require('../../../common/models/Product')
const { Category } = require('../../../common/models/Category')

const pagination = require('../../../common/helpers/pagination')
const { NotFoundError } = require('../../../common/errors/http-errors')

async function getAll(req, res) {
  const itemCount = await repository.getCount()
  const options = pagination(req.query, itemCount)

  const service = await repository.getAll(options)
  return res
    .status(200)
    .json({ data: service })
}

async function getOne(req, res) {
  const category = await repository.getOne(req.params.id)
  return res
    .status(200)
    .json({ data: category })
}

async function getOneByIdOrFail(req, res) {
  const category = await repository.getOne(req.params.id)
  if (!category) throw new NotFoundError('Category not found')
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

async function getProductsByCategory(req, res) {
  const category = await repository.getOneByIdOrFail(req.params.id, {
    include: {
      model: Product,
      as: 'products',
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    }
  })
  
  return res.status(200).json({ data: category })
}

async function updateOne(req, res) {
  

  await Category.update(req.body, { where: { id: req.params.id } })
  return res.json({ status: 200 })
}

module.exports = {
  getAll,
  getOne,
  getOneByIdOrFail,
  getProductsByCategory,
  updateOne
}
