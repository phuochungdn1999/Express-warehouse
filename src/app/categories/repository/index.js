const { Category } = require("../../../common/models/Category")

async function getCount() {
  const itemCount = await Category.count()
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

module.exports = {
  getCount, 
  getAll,
  getOne
}
