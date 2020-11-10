const { User } = require('../../../common/models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

async function auth(req, res) {
  const user = await User.findOne({ where: { email: req.body.email } })
  if (!user) return res.status(401).json({
    message: 'Invalid email or password'
  })

  const isValid = await bcrypt.compare(req.body.password, user.password)
  if (!isValid) return res.status(401).json({
    message: 'Invalid email or password'
  })

  // authenticate success
  const permissions = await user.getPermissions()
  const permissionIds = permissions.map(p => {
    return { id: p.id, permission: p.permissionName }
  })

  const payload = { id: user.id, permissionIds }
  return res.status(200).json({ token: await jwt.sign(payload, process.env.JWT_KEY) })
}

module.exports = {
  auth
}
