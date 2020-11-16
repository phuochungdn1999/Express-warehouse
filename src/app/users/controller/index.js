const router = require('express').Router()
const { validateUser } = require('../../../common/models/User')
const service = require('../service')
const { auth } = require('../../../common/middlewares/auth')

router.get('/', async (req, res) => {
  return await service.getAll(req, res)
})

router.post('/', [auth, validateUser], async (req, res) => {
  return await service.createOne(req, res)
})

router.get('/:id', async (req, res) => {
  return await service.getOne(req, res)
})

router.patch('/:id', [auth, validateUser], async (req, res) => {
  return await service.updateOne(req, res)
})

router.post('/insertUsers',async (req, res) => {
  return await service.insertAll(req,res)
})

router.get('/search/:text',[auth],async (req, res)=>{
  return await service.search(req,res)
})

module.exports = router
