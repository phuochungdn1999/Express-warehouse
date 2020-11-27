const router = require('express').Router()
const service = require('../service')
const { validateWarehouse } = require('../../../common/models/Warehouse')
const { checkAction } = require('../../../common/middlewares/check-action')
const {auth} = require('../../../common/middlewares/auth')

router.get('/', async (req, res) => {
  return await service.getAll(req, res)
})//done

/* get warehouse by userId */
router.get('/user', [auth], async (req, res) => {
  return await service.getWarehouseByUserId(req, res)
})//done

router.get('/:id', [auth], async (req, res) => {
  return await service.getOne(req, res)
})//done

/* get warehouse by id with list users */
router.get('/:id/users', [auth], async (req, res) => {
  return await service.getOneWithUsers(req, res)
})//done

/* apply a user to a warehouse */
router.post('/user', [
  auth, 
  checkAction(['EDIT_USER', 'EDIT_WAREHOUSE'])
], async (req, res) => {
  return await service.applyUserToWarehouse(req, res)
})//done

router.post('/', [validateWarehouse], async (req, res) => {
  return await service.createOne(req, res)
})//done

router.patch('/:id', [auth, validateWarehouse], async (req, res) => {
  return await service.updateOne(req, res)
})//done

router.get('/chief/:id', [auth], async (req, res) => {
  return await service.getChiefUserOfWarehouse(req.params.id)
})


module.exports = router
