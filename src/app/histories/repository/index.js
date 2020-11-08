const { History } = require("../../../common/models/History")

async function getCount() {
  const itemCount = await History.count()
  return itemCount
}

async function getAll(options) {
  const histories = await History.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    ...options
  })
  return {
    histories,
    ...options
  }
}

async function getOne(id) {
  const history = await History.findOne({ 
    where: { id },
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  })
  return history
}

module.exports = {
  getCount, 
  getAll,
  getOne
}
