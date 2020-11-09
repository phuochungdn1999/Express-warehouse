const router = require('express').Router()
const service = require('../service')

router.get('/', async (req, res) => {
  return await service.getAll(req, res)
})

router.get('/:id', async (req, res) => {
  return await service.getOne(req, res)
})

// get products by their warehouse
router.get('/warehouse/:id', async (req, res) => {
  return await service.getProductInWarehouse(req, res)
})

module.exports = router
