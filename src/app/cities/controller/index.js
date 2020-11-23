const router = require('express').Router()
const service = require('../service')
const { auth } = require('../../../common/middlewares/auth')
const { validateCity } = require('../../../common/models/City')

router.get('/', async (req, res) => {
  return await service.getAll(req, res)
})//done

router.get('/:id', async (req, res) => {
  return await service.getOne(req, res)
})//done
//get warehouse in city 
router.get('/warehouses/:id',async (req, res) => {
  return await service.getWarehousesInCity(req, res)
})//done

router.post('/', [validateCity], async (req, res) => {
  return await service.createOne(req, res)
})//done

router.patch('/:id', [auth, validateCity], async (req, res) => {
  return await service.updateOne(req, res)
})//done
module.exports = router
