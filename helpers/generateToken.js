import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
/**
 * Gnerate Token
 * @param {string} email - user's email
 * @param {string} userId - user's id
 * @param {string} role - user's role ['runner', 'customer']
 * @returns {string} - generated token
 */
const generateToken = (email, userId, role, username) => {
  const token = jwt.sign(
    {
      email,
      userId,
      role,
      username
    },
    process.env.SECRET_KEY,
    {
      expiresIn: 86400 // 24 hours
    }
  );

  return token;
};

export default generateToken;
