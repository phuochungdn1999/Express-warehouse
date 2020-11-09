const repository = require('../repository')
const pagination = require('../../../common/helpers/pagination')

async function getAll(req, res) {
  const itemCount = await repository.getCount()
  const options = pagination(req.query, itemCount)

  const categories = await repository.getAll(options)
  return res
    .status(200)
    .json({ data: categories })
}

async function getOne(req, res) {
  const category = await repository.getOne(req.params.id)
  if (!category) {
    return res
      .status(404)
      .json({ message: 'Category not found' })
  }
  return res
    .status(200)
    .json({ data: category })
}

module.exports = {
  getAll,
  getOne
}
