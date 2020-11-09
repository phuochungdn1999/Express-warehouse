const router = require('express').Router()
const service = require('../service')

router.get('/', async (req, res) => {
  return await service.getAll(req, res)
})

router.get('/:id', async (req, res) => {
  return await service.getOne(req, res)
})

module.exports = router
