const router = require('express').Router()
const { validateUser } = require('../../../common/models/User')
const service = require('../service')
const { auth } = require('../../../common/middlewares/auth')

router.get('/', async (req, res) => {
  return await service.getAll(req, res)
})

router.get('/:id', async (req, res) => {
  return await service.getOne(req, res)
})

router.patch('/:id', [auth, validateUser], async (req, res) => {
  return await service.updateOne(req, res)
})

module.exports = router
