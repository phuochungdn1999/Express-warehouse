const router = require('express').Router()
const service = require('../service')

const { validateCity } = require('../../../common/models/City')

router.get('/', async (req, res) => {
  return await service.getAll(req, res)
})

router.get('/:id', async (req, res) => {
  return await service.getOne(req, res)
})
//get warehouse in city 
router.get('/warehouses/:id',async (req, res) => {
  return await service.getWarehousesInCity(req, res)
})

router.post('/', [validateCity], async (req, res) => {
  return await service.createOne(req, res)
})
module.exports = router
