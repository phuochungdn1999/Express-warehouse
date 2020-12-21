const pagination = require('../../../common/helpers/pagination')
const { User } = require('../../../common/models/User')
const { Permission } = require('../../../common/models/Permission')
const sequelize = require('../../../database/connection')
const client = require("../../../database/esConnection")

const repository = require('../repository')
const permissionRepository = require('../../permissions/repository')
const { NotFoundError, InternalServerError } = require('../../../common/errors/http-errors')

async function getAll(req, res) {
  const itemCount = await repository.getCount()
  let options = pagination(req.query, itemCount)
  options = {
    ...options,
    include: {
      model: Permission,
      as: 'permissions',
    },
  }

  const users = await repository.getAll(options)
  return res
    .status(200)
    .json({ data: users })
}

async function getOne(req, res) {
  const user = await repository.getOneWithOptions({
    where: { id: req.params.id }
  })
  if (!user) {
    return res
      .status(404)
      .json({ message: 'User not found' })
  }
  return res
    .status(200)
    .json({ data: user })
}

async function createOne(req,res){
  const transaction = await sequelize.transaction()
  const { phone, email } = req.body
  
  await repository.failIfDuplicated({ phone })
  await repository.failIfDuplicated({ email })

  const user = await repository.createOne(req.body, { transaction: transaction })
  
  const permission = await permissionRepository.getOneByName("EMPLOYEE")
  if (!permission) throw new NotFoundError(`Permission "EMPLOYEE" not found`)

  try { await user.addPermission(permission.id, { transaction }) } 
  catch (error) {
    await transaction.rollback()
    console.log(error.message)
    throw new InternalServerError("Internal server error")
  }

  await transaction.commit()
  return res
    .status(201)
    .json({
      data: user
    })
}

async function updateOne(req, res) {
 
  await User.update(req.body, { where: { id: req.params.id } })
  await updateToEs(req)
  return res.json({ status: 200 })
}

async function updateToEs(req){
  client.update({
    index:"users",
    id:req.params.id,
    body:{
      doc:{
        name:req.body.name,
        phone:req.body.phone,
        email:req.body.email
      }
    }
  }).then(()=>{
    console.log("Update Success")
  },(err)=>{
    console.log(err.message);
  })
}

async function insertAll(req,res){
  const message = await repository.insertAll();
  return res
      .status(200)
      .json({ statusCode: 200 ,message:message})
}
async function search(req,res){
  let body = {
    size: req.query.size||100,
    from: 0, 
    query: {
      bool:{
        should:[
          {
            query_string: {
            fields: ["name", "phone"],
            query: `*${req.params.text.toLocaleLowerCase()}*`
          }},
          {
            match_phrase_prefix : {
              email: `*${req.params.text.toLocaleLowerCase()}*`
          }
          }
        ]
      }
      
    }
  }
  const data = await repository.search(body);
  return res.status(200).json({data})
}

async function deleteOne(req, res) {
  const user = await getOne(req, res)
  const isDeleted = await repository.deleteOne(user.id)
  if (!isDeleted) throw new InternalServerError("Failed to delete")
}

module.exports = {
  getAll,
  getOne,
  updateOne,
  insertAll,
  search,
  createOne,
  deleteOne,
}
