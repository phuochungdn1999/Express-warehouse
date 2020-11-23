const Joi = require('joi')
const sequelize = require('../../database/connection')
const { DataTypes } = require('sequelize')

const Category = sequelize.define('Category', {
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
    defaultValue: 'https://store.webkul.com/media/catalog/product/cache/1/thumbnail/250x250/9df78eab33525d08d6e5fb8d27136e95/a/k/akeneo-category-image-and-description_3_.png'
  }
}, {
  tableName: 'categories'
})

/**
 * @Usage Validate category as a middleware
 */
function validateCategory(req, res, next) {
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
  if (error) return res.status(400).json({ statusCode: 400, message: error.message })
  else next() // no error
}

module.exports = {
  Category,
  validateCategory
}