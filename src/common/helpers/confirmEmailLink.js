async function confirmEmailLink (user){
  console.log(user)

  return `\n Welcome to Warehouse Management \n Hello ${user.name}`;
};

module.exports = {
  confirmEmailLink
}