const router = require('express').Router()
const service = require('../service')
const { validateWarehouse } = require('../../../common/models/Warehouse')


router.get('/', async (req, res) => {
  return await service.getAll(req, res)
})

router.get('/:id', async (req, res) => {
  return await service.getOne(req, res)
})
router.post('/', [validateWarehouse], async (req, res) => {
  return await service.createOne(req, res)
})
module.exports = router
