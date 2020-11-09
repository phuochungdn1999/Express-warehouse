const { HttpError } = require("../errors/http-errors")

/**
 * @Usage This function is a middleware that 
 * handle uncaught exception thrown in route handler
 */
module.exports = function(err, req, res, next) {
  console.log('Error:', err)
  if (err instanceof HttpError) {
    return res.status(err.code).json({ message: err.message })
  }
  return res.status(500).json({
    statusCode: 500,
    message: 'Internal server error',
    error: err.message
  })
}
