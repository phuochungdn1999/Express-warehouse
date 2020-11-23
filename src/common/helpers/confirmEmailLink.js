async function confirmEmailLink (user){
  console.log(user)

  return `<p> Welcome to Warehouse Management </p> <p>Hello ${user.name}</p>`;
};

module.exports = {
  confirmEmailLink
}