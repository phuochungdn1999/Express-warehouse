const repository = require('../repository')
const pagination = require('../../../common/helpers/pagination')

async function getAll(req, res) {
  const itemCount = await repository.getCount()
  const options = pagination(req.query, itemCount)

  const histories = await repository.getAll(options)
  return res
    .status(200)
    .json({ data: histories })
}

async function getOne(req, res) {
  const history = await repository.getOne(req.params.id)
  if (!history) {
    return res
      .status(404)
      .json({ message: 'History not found' })
  }
  return res
    .status(200)
    .json({ data: history })
}

async function getTypes(req, res) {
  const itemCount = await repository.getCount()
  const options = pagination(req.query, itemCount)

  const types = await repository.getTypes(options)
  return res
    .status(200)
    .json({ data: types })
}

module.exports = {
  getAll,
  getOne,
  getTypes,
}
