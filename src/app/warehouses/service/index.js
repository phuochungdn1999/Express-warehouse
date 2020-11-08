const repository = require('../repository')
const pagination = require('../../../common/helpers/pagination')

async function getAll(req, res) {
  const itemCount = await repository.getCount()
  const options = pagination(req.query, itemCount)

  const warehouses = await repository.getAll(options)
  return res
    .status(200)
    .json({ data: warehouses })
}

async function getOne(req, res) {
  const warehouse = await repository.getOne(req.params.id)
  if (!warehouse) {
    return res
      .status(404)
      .json({ message: 'Warehouse not found' })
  }
  return res
    .status(200)
    .json({ data: warehouse })
}

module.exports = {
  getAll,
  getOne
}
