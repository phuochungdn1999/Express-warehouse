const { History } = require("../../../common/models/History")
const { HistoryType } = require("../../../common/models/HistoryType")

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

async function getTypes(options) {
  const types = await HistoryType.findAll({ 
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    ...options
  })
  return types
}

module.exports = {
  getCount, 
  getAll,
  getOne,
  getTypes,
}
