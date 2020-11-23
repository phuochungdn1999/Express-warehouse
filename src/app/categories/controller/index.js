const router = require('express').Router()
const service = require('../service')
const { validateCategory } = require('../../../common/models/Category')
const { auth } = require('../../../common/middlewares/auth')

router.get('/', async (req, res) => {
  return await service.getAll(req, res)
})
//done
router.get('/:id', async (req, res) => {
  return await service.getOne(req, res)
})//done

router.post('/', [validateCategory], async (req, res) => {
  return await service.createOne(req, res)
})//done

router.get('/products/:id', async (req, res) => {
  return await service.getProductsByCategory(req, res)
})//done

router.patch('/:id', [auth, validateCategory], async (req, res) => {
  return await service.updateOne(req, res)
})//done


module.exports = router
