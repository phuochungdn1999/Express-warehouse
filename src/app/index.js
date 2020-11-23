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
const {swaggerDocumentAuth}= require('../common/swagger/index')
require('../common/helpers/handle-uncaught-errors')()
require('../common/helpers/model-association')()
// require('../database/db-sync')()

app.use(express.json())
app.use(morgan('dev'))

app.use('/auth', auth)
app.use('/users', users)
app.use('/warehouses', warehouses)
app.use('/permissions', permissions)
app.use('/products', products)
app.use('/histories', histories)
app.use('/categories', categories)
app.use('/cities', cities)
app.use('/api-docs-auth', swaggerUi.serve, swaggerUi.setup(swaggerDocumentAuth));//swagger for auth


app.use(error)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})