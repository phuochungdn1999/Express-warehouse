const { v4 } = require( 'uuid');
const { redis } = require('./redis');

async function confirmEmailLink (userId){
  const id = v4();

  await redis.set(id, userId, 'ex', 60 * 60 * 15);

  return `http:localhost:3000/user/confirm/${id}`;
};

module.exports = {
    confirmEmailLink,
    
}