require('express-async-errors')
const express = require('express')
const app = express()
const morgan = require('morgan')
const swaggerUi = require('swagger-ui-express')

const users = require('./users/controller')
const warehouses = require('./warehouses/controller')
const permissions = require('./permissions/controller')
const products = require('./products/controller')
const histories = require('./histories/controller')
const categories = require('./categories/controller')
const cities = require('./cities/controller')
const auth = require('./auth/controller')
const error = require('../common/middlewares/error-handler-middleware')
const { PORT } = require('../common/environments')
const {swaggerDocumentAuth,swaggerDocumentProduct,swaggerDocumentUser,swaggerDocumentCity,swaggerDocumentCategory,swaggerDocumentWarehouse}= require('../common/swagger/index')
require('../common/helpers/handle-uncaught-errors')()
require('../common/helpers/model-association')()
var path = require('path')

// require('../database/db-sync')()
app.use(express.json())
app.use(morgan('dev'))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
})
app.use('/auth', auth)
app.use('/users', users)
app.use('/warehouses', warehouses)
app.use('/permissions', permissions)
app.use('/products', products)
app.use('/histories', histories)
app.use('/categories', categories)
app.use('/cities', cities)

app.use('/api-docs-auth', swaggerUi.serve, swaggerUi.setup(swaggerDocumentAuth));//swagger for auth
app.use('/api-docs-product', swaggerUi.serve, swaggerUi.setup(swaggerDocumentProduct));//swagger for product
app.use('/api-docs-user', swaggerUi.serve, swaggerUi.setup(swaggerDocumentUser));//swagger for user
app.use('/api-docs-city', swaggerUi.serve, swaggerUi.setup(swaggerDocumentCity));//swagger for city
app.use('/api-docs-category', swaggerUi.serve, swaggerUi.setup(swaggerDocumentCategory));//swagger for category
app.use('/api-docs-warehouse', swaggerUi.serve, swaggerUi.setup(swaggerDocumentWarehouse));//swagger for category

app.use(error)
<<<<<<< HEAD
app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port 3000`)
=======
app.listen(PORT || 3000, () => {
  console.log(`Listening on port ${PORT}`)
>>>>>>> 2e1ef2c71f788b9dceba5457a43845fc5261e311
})

