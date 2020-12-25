const swaggerUi = require('swagger-ui-express')
const swaggerDocumentAuth = require('./swagger-auth.json');
const swaggerDocumentProduct = require('./swagger-product.json');
const swaggerDocumentUser = require('./swagger-user.json');
const swaggerDocumentCity = require('./swagger-city.json');
const swaggerDocumentCategory = require('./swagger-category.json');
const swaggerDocumentWarehouse = require('./swagger-warehouse.json');
const swaggerDocumentHistory = require('./swagger-history.json');

module.exports ={
    swaggerDocumentAuth,
    swaggerDocumentProduct,
    swaggerDocumentUser,
    swaggerDocumentCity,
    swaggerDocumentCategory,
    swaggerDocumentWarehouse,
    swaggerDocumentHistory
}