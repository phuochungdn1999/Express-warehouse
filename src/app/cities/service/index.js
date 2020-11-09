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
  const city = await repository.getOne(req.params.id)
  if (!city) {
    return res
      .status(404)
      .json({ message: 'City not found' })
  }
  return res
    .status(200)
    .json({ data: city })
}

module.exports = {
  getAll,
  getOne
}
