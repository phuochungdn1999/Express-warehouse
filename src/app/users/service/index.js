const repository = require('../repository')
const pagination = require('../../../common/helpers/pagination')

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

module.exports = {
  getAll,
  getOne
}
