const Joi = require('joi')
const sequelize = require('../../database/connection')
const { DataTypes } = require('sequelize')
const { BadRequestError } = require('../errors/http-errors')

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER(),
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(),
    allowNull: false,
    unique: true,
    validate: {
      is: /^[0-9]*$/
    }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      is: /\S+@\S+\.\S+/
    }
  },
  password: {
    type: DataTypes.STRING(1024),
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(255)
  },
  image: {
    type: DataTypes.STRING(1024),
    allowNull: false,
    defaultValue: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRlUbAyS_643dq_B69jZAlPNW6_Xc7SLELY6SpRsc5OI2wHiiYG&usqp=CAU'
  }
})

/**
 * @Usage Validate user as a middleware
 */
function validateUser(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().max(255),
    phone: Joi.string().min(10).max(11),
    email: Joi.string().email().max(255),
    password: Joi.string().max(50),
    address: Joi.string().max(255).optional(),
    image: Joi.string().max(1024).optional(),
  })
  // seek for error
  const { error } = schema.validate(req.body, {
    presence: (req.method !== 'PATCH') ? 'required': 'optional',
    abortEarly: false
  })
  // response when having error
  if (error) throw new BadRequestError(error.message)
  else next() // no errors
}

/**
 * @Usage Validate user permissions as a middleware
 */
function validateUserPermission(req, res, next) {
  const schema = Joi.object({
    userId: Joi.number(),
    permissionIds: Joi.array().items(Joi.number())
  })
  // seek for error
  const { error } = schema.validate(req.body, {
    presence: (req.method !== 'PATCH') ? 'required': 'optional',
    abortEarly: false
  })
  // response when having error
  if (error) throw new BadRequestError(error.message)
  else next() // no errors
}

module.exports = {
  User,
  validateUser,
  validateUserPermission
}
