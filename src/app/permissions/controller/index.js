const router = require('express').Router()
const service = require('../service')
const { validatePermission } = require('../../../common/models/Permission')


router.get('/', async (req, res) => {
  return await service.getAll(req, res)
})

router.get('/:id', async (req, res) => {
  return await service.getOne(req, res)
})

router.get('/:id/details', async (req, res) => {
  return await service.getDetails(req, res)
})

router.post('/', [validatePermission], async (req, res) => {
  return await service.createOne(req, res)
})

module.exports = router
