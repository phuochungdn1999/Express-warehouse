const { User } = require("../../../common/models/User")
const { Warehouse } = require("../../../common/models/Warehouse")
const client = require("../../../database/esConnection")
const { sendEmail } = require('../../../common/helpers/sendEmail')
const {confirmEmailLink} = require('../../../common/helpers/confirmEmailLink')
const { ConflictedError } = require("../../../common/errors/http-errors")
const bcrypt = require('bcrypt')

async function getCount(options) {
  const itemCount = await User.count(options)
  return itemCount
}

async function getAll(options) {
  const users = await User.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
    ...options
  })
  return {
    users,
    ...options
  }
}

async function getOne(id) {
  const user = await User.findOne({ 
    where: { id },
    attributes: { exclude: ['createdAt', 'updatedAt', 'password'] }
  })
  return user
}

async function getOneByIdOrFail(id, options) {
  const warehouse = await Warehouse.findOne({ 
    where: { id },
    ...options
  })
  if (!warehouse) throw new NotFoundError('Warehouse not found')
  return warehouse
}

async function createOne(body, options) {
  await failIfDuplicated({
    phone: body.phone,
    email: body.email
  })
  body.password = await bcrypt.hash(body.password, await bcrypt.genSalt())
  const user =  await User.create(body, options)
  // await sendEmail(body.email,await confirmEmailLink(user))
  // await insertOneToEs(user)
  return user;
}

async function insertOneToEs(user){
  let bulkBody = [];
  bulkBody.push({
    index: {
        _index: "user",
        _type: "_doc",
        _id: user.id
    }
  });  
  bulkBody.push(user);
  client.bulk({index: 'user', body: bulkBody})
  return "Insert elasticsearch success"
}

async function failIfDuplicated(condition) {
  const count = await getCount({ where: condition })
  if (count > 0) throw new ConflictedError('Duplicated')
}

async function insertAll(){  
  const user = await User.findAll({
    attributes: {
        exclude: ['createdAt', 'updatedAt', 'address','password']
    }
  })
  let bulkBody = [];

  user.forEach(item => {
    bulkBody.push({
        index: {
            _index: "user",
            _type: "_doc",
            _id: item.id
        }
    });
    bulkBody.push(item);
  });  
  client.bulk({index: 'user', body: bulkBody})
  return "Insert elasticsearch success"
}

async function search(body) {
  let results =await client.search({
    index:'user',  body:body
  })   

  users = results.hits.hits.map(o=>({id:o._source.id,name:o._source.name,phone:o._source.phone,email:o._source.email}))
  return {
    statusCode:200,
    data:{users:users},
    total:users.length>0?users.length:0
  }
  
}

module.exports = {
  getCount, 
  getAll,
  getOne,
  getOneByIdOrFail,
  insertAll,
  search,
  createOne,
  failIfDuplicated
}
