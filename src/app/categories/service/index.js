const repository = require('../repository')
const pagination = require('../../../common/helpers/pagination')
const { NotFoundError } = require('../../../common/errors/http-errors')

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
  return res
    .status(200)
    .json({ data: category })
}

async function getOneByIdOrFail(req, res) {
  const category = await repository.getOne(req.params.id)
  if (!category) throw new NotFoundError('Category not found')
  return res
    .status(200)
    .json({ data: category })
}

module.exports = {
  getAll,
  getOne,
  getOneByIdOrFail,
}
