const express = require('express')
const app = express()
const morgan = require('morgan')
const error = require('../common/middlewares/error-handler-middleware')
const users = require('./users/controller')
const warehouses = require('./warehouses/controller')
const permissions = require('./permissions/controller')
const products = require('./products/controller')
const histories = require('./histories/controller')

require('../common/helpers/handle-uncaught-errors')()

app.use(express.json())
app.use(morgan('dev'))

app.use('/users', users)
app.use('/warehouses', warehouses)
app.use('/permissions', permissions)
app.use('/products', products)
app.use('/histories', histories)
app.use(error)

const port = process.env.PORT | 3000
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
