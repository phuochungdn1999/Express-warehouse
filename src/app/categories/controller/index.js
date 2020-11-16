const router = require('express').Router()
const service = require('../service')
const { validateCategory } = require('../../../common/models/Category')
const { auth } = require('../../../common/middlewares/auth')

router.get('/', async (req, res) => {
  return await service.getAll(req, res)
})

router.get('/:id', async (req, res) => {
  return await service.getOne(req, res)
})

router.post('/', [validateCategory], async (req, res) => {
  return await service.createOne(req, res)
})

router.get('/products/:id', async (req, res) => {
  return await service.getProductsByCategory(req, res)
})

router.patch('/:id', [auth, validateCategory], async (req, res) => {
  return await service.updateOne(req, res)
})


module.exports = router
