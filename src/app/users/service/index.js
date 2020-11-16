const repository = require('../repository')
const pagination = require('../../../common/helpers/pagination')
const { User } = require('../../../common/models/User')

async function getAll(req, res) {
  const itemCount = await repository.getCount()
  const options = pagination(req.query, itemCount)

  const users = await repository.getAll(options)
  return res
    .status(200)
    .json({ data: users })
}

async function getOne(req, res) {
  const user = await repository.getOne(req.params.id)
  if (!user) {
    return res
      .status(404)
      .json({ message: 'User not found' })
  }
  return res
    .status(200)
    .json({ data: user })
}

async function updateOne(req, res) {
 
  await User.update(req.body, { where: { id: req.params.id } })
  return res.json({ status: 200 })
}

module.exports = {
  getAll,
  getOne,
  updateOne
}
