/**
 * @Usage This function call express-async-errors package,
 * also handle uncaught exception & unhandled rejection
 */
module.exports = function() {
  require('express-async-errors')

  process.on('uncaughtException', err => {
    console.log('Uncaught Exception thrown', err)
  })

  process.on('unhandledRejection', err => {
    console.log('Unhandled Rejection', err)
  })
}
