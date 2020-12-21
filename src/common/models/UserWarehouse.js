const sequelize = require('../../database/connection')
const { DataTypes } = require('sequelize')
const Joi = require('joi')

const UserWarehouse = sequelize.define('UserWarehouse', {
  id: {
    type: DataTypes.INTEGER(),
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER()
  },
  warehouseId: {
    type: DataTypes.INTEGER()
  },
}, {
  tableName: 'user_warehouses'
})

function validateUserWarehouse(req, res, next) {
  const schema = Joi.object({
    userEmail: Joi.string().email(),
    warehouseId: Joi.number()
  })
  // seek for error
  const { error } = schema.validate(req.body, {
    presence: (req.method !== 'PATCH') ? 'required' : 'optional',
    abortEarly: false
  })
  // response when having error
  if (error) throw new BadRequestError(error.message)
  else next() // no error
}

module.exports = {
  UserWarehouse,
  validateUserWarehouse
}
