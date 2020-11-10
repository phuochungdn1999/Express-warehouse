const router = require('express').Router()
const service = require('../service')
const Joi = require('joi')

router.post('/', [validateAuth], async (req, res) => {
  return await service.auth(req, res)
})

function validateAuth(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().email().max(255),
    password: Joi.string().max(50)
  })
  // seek for error
  const { error } = schema.validate(req.body, {
    presence: 'required',
    abortEarly: false
  })
  // response when having error
  if (error) return res.json({ statusCode: 400, message: error.message })
  else next() // no errors
}

module.exports = router