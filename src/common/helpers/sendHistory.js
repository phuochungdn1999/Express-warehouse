async function sendHistoryToEmail (chief,warehouse,products,user){
    const userStr = `<p>Email send to ${chief.name}</p>`
    const warehouseStr = `<p></p>Employee: ${user.name} IMPORT/EXPORT products in Warehouse: ${warehouse.name}</p>`
    var productStr = ''
    for(var i=0;i<products.length;i++){
       productStr += `<p>${products[i].name} ${products[i].actionType} ${products[i].stock} </p>`
    }
    console.log("asdas",productStr)
    return userStr+warehouseStr+productStr

  };
  
module.exports = {
  sendHistoryToEmail
}