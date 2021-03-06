const router = require('express').Router()
const service = require('../service')
const { auth } = require('../../../common/middlewares/auth')
const { validateManagingProduct, validateProduct } = require('../../../common/models/Product')
const { checkAction } = require('../../../common/middlewares/check-action')

router.get('/', async (req, res) => {
  return await service.getAll(req, res)
})//done

router.get('/:id', async (req, res) => {
  return await service.getOne(req, res)
})//done

router.get('/test/:name', async (req, res) => {
  return await service.searchByName(req,res)
})//done
// get products by their warehouse
router.get('/warehouse/:id', async (req, res) => {
  return await service.getProductInWarehouse(req, res)
})//done

/**
 * @Usage This route is used for 2 purposes:
 *        Create new product then import it into the specified warehouse.
 *        Handle import/export product of users.
 */
router.post('/', [
  auth, 
  checkAction(['CREATE_PRODUCT']),
  validateManagingProduct
], async (req, res) => {
  return await service.createOne(req, res)
})//done

router.patch('/:id', [
  auth, 
  checkAction(['EDIT_PRODUCT']),
  validateProduct
], async (req, res) => {
  return await service.updateOne(req, res)
})//done

router.post('/insertProducts',async (req, res) => {
  return await service.insertAll(req,res)
})

router.get('/search/:productName',[auth],async (req, res)=>{
  return await service.search(req,res)
})

module.exports = router
