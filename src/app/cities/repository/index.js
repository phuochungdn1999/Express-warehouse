const { City } = require("../../../common/models/City")

async function getCount() {
  const itemCount = await City.count()
  return itemCount
}

async function getAll(options) {
  const histories = await City.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    ...options
  })
  return {
    histories,
    ...options
  }
}

async function getOne(id) {
  const city = await City.findOne({ 
    where: { id },
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  })
  return city
}

module.exports = {
  getCount, 
  getAll,
  getOne
}
