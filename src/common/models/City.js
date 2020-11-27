const Joi = require('joi')
const sequelize = require('../../database/connection')
const { DataTypes } = require('sequelize')

const City = sequelize.define('City', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.STRING(255),
  },
  image: {
    type: DataTypes.STRING(1024),
    allowNull: false,
    defaultValue: 'https://i.dlpng.com/static/png/6347627_preview.png'
  }
}, {
  tableName: 'cities'
})

/**
 * @Usage Validate city as a middleware
 */
function validateCity(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().max(255),
    description: Joi.string().max(255).optional(),
    image: Joi.string().max(1024).optional(),
  })
  // seek for error
  const { error } = schema.validate(req.body, {
    presence: (req.method !== 'PATCH') ? 'required' : 'optional',
    abortEarly: false
  })
  // response when having error
  if (error) throw new BadRequestError(error.message)
  else next() // no errors
}

module.exports = {
  City,
  validateCity
}