async function confirmEmailLink (histories){
    console.log(histories)
  
    return `\n Welcome to Warehouse Management \n Hello ${histories}`;
  };
  
  module.exports = {
    confirmEmailLink
  }