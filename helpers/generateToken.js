import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
/**
 * Gnerate Token
 * @param {string} email - user's email
 * @param {string} userId - user's id
 * @param {string} role - user's role ['customer-merchant', 'influencer']
 * @param {array} productsofinterest - user's products of interest to buy, sell or influence
 * @returns {string} - generated token
 */
const generateToken = (email, userId, role, username, productsofinterest) => {
  const token = jwt.sign(
    {
      email,
      userId,
      role,
      username,
      productsofinterest
    },
    process.env.SECRET_KEY,
    {
      expiresIn: 86400 // 24 hours
    }
  );

  return token;
};

export default generateToken;
