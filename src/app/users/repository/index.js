const { User } = require("../../../common/models/User")

async function getCount() {
  const itemCount = await User.count()
  return itemCount
}

async function getAll(options) {
  const users = await User.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
    ...options
  })
  return {
    users,
    ...options
  }
}

async function getOne(id) {
  const user = await User.findOne({ 
    where: { id },
    attributes: { exclude: ['createdAt', 'updatedAt', 'password'] }
  })
  return user
}

module.exports = {
  getCount, 
  getAll,
  getOne
}
