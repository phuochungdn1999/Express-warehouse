const { NotFoundError } = require("../../../common/errors/http-errors")
const { Product } = require("../../../common/models/Product")
const { Permission } = require("../../../common/models/Permission")
const client = require("../../../database/esConnection")

async function getCount(options) {
  const itemCount = await Product.count(options)
  return itemCount
}

async function getAll(options) {
  const products = await Product.findAll({
    ...options
  })
  return {
    products
  }
}

async function getOne(id, options) {
  const product = await Product.findOne({ 
    where: { id },
    ...options
  })
  return product
}

async function getOneByName(name) {
  return await Product.findOne({ where: { name } })
}

async function getOneByIdOrFail(id, options) {
  const product = await Product.findOne({ 
    where: { id },
    ...options
  })
  if (!product) throw new NotFoundError('Product not found')
  return product
}

async function createOne(body, options) {
  return Permission.create(body, options)
}

async function failIfDuplicated(condition) {
  const count = await getCount({ where: condition })
  if (count > 0) throw new ConflictedError('Duplicated')
}

async function insertAll(){  
  const product = await Product.findAll({
    attributes: {
        exclude: ['createdAt', 'updatedAt', 'categoryId', 'note']
    }
})
  let bulkBody = [];

    product.forEach(item => {
        bulkBody.push({
            index: {
                _index: "product",
                _type: "_doc",
                _id: item.id
            }
        });

        bulkBody.push(item);

    });  
    client.bulk({index: 'product', body: bulkBody})
    return "Insert elasticsearch success"
}

async function search(body) {
  let results =await client.search({
    index:'product',  body:body
  })   

  products = results.hits.hits.map(o=>({id:o._source.id,name:o._source.name}))
  console.log('o123',products)
  //console.log("oke2",results.hits.hits)
  return {
    statusCode:200,
    data:{products:products},
    total:products.length>0?products.length:0
  }
  
}

async function searchByName(body) {
  let results =await client.search({
    index:'product',  body:body
  })   
  return {
    results
  }
  
}




module.exports = {
  getCount, 
  getAll,
  getOne,
  getOneByName,
  getOneByIdOrFail,
  failIfDuplicated,
  createOne,
  insertAll,
  search,
  searchByName
}
