const router = require('express').Router()
const { validateUser } = require('../../../common/models/User')
const service = require('../service')
const { auth } = require('../../../common/middlewares/auth')

router.get('/', async (req, res) => {
  return await service.getAll(req, res)
})//done

router.post('/', [validateUser], async (req, res) => {
  return await service.createOne(req, res)
})//done

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

router.delete('/:id', [auth], async (req, res) => {
  return await service.deleteOne(req, res)
})

module.exports = router
