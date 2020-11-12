const { NotFoundError } = require("../../../common/errors/http-errors")
const { Category } = require("../../../common/models/Category")
const { Product } = require("../../../common/models/Product")
const { ConflictedError } = require("../../../common/errors/http-errors")

async function getCount(options) {
  const itemCount = await Category.count(options)
  return itemCount
}

async function getAll(options) {
  const categories = await Category.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    ...options
  })
  return {
    categories,
    ...options
  }
}

async function getOne(id) {
  const category = await Category.findOne({ 
    where: { id },
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  })
  return category
}

async function getOneByIdOrFail(id,options) {
  const category = await Category.findOne({ 
    where: { id },
    ...options,
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  })
  if (!category) throw new NotFoundError('Category not found')
  return category
}

async function createOne(body, options) {
  await failIfDuplicated({ name: body.name })
  return Category.create(body, options)
}

async function failIfDuplicated(condition) {
  const count = await getCount({ where: condition })
  if (count > 0) throw new ConflictedError('Duplicated')
}
async function getProductsByCategory(body,options) {
  const category = await Category.findOne({
    where: {
        id: body.id
    }
})
if (!category) 
    return null
const products = await category.getProducts({
    attributes: {
        exclude: ['createdAt', 'updatedAt']
    }
})
console.log(options)
return products

}


module.exports = {
  getCount, 
  getAll,
  getOne,
  getOneByIdOrFail,
  createOne,
  getProductsByCategory
}
