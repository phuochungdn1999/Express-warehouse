const { User } = require("../../../common/models/User")
const client = require("../../../database/esConnection")

async function getCount() {
  const itemCount = await User.count()
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
            _index: "products",
            _type: "_doc",
            _id: item.id
        }
    });
    bulkBody.push(item);
  });  
  client.bulk({index: 'products', body: bulkBody})
  return "Insert elasticsearch success"
}

async function search(body) {
  let results =await client.search({
    index:'users',  body:body
  })   

  users = results.hits.hits.map(o=>({id:o._source.id,name:o._source.name,phone:o._source.phone,email:o._source.email}))
  console.log('o123',users)
  //console.log("oke2",results.hits.hits)
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
  search
}
