const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const generateToken = (id) =>{
    return jwt.sign({id},process.env.JWT);
}

module.exports = generateToken;