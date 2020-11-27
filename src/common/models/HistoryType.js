const Joi = require('joi')
const sequelize = require('../../database/connection')
const { DataTypes } = require('sequelize')

const HistoryType = sequelize.define('HistoryType', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(255),
  },
}, {
  tableName: 'history_types'
})

/**
 * @Usage Validate history type as a middleware
 */
function validateType(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().max(255),
    description: Joi.string().max(255).optional()
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
  HistoryType,
  validateType
}