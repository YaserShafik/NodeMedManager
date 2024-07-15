const crypto = require('crypto');

// Generate a random secret key
const secretKey = crypto.randomBytes(64).toString('hex');
console.log(secretKey);
