const repository = require('../repository')
const pagination = require('../../../common/helpers/pagination')

async function getAll(req, res) {
  const itemCount = await repository.getCount()
  const options = pagination(req.query, itemCount)

  const products = await repository.getAll(options)
  return res
    .status(200)
    .json({ data: products })
}

async function getOne(req, res) {
  const product = await repository.getOne(req.params.id)
  if (!product) {
    return res
      .status(404)
      .json({ message: 'Product not found' })
  }
  return res
    .status(200)
    .json({ data: product })
}

module.exports = {
  getAll,
  getOne
}
