import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import model from '../models';
import { generateToken, StatusResponse, findUser } from '../helpers';

dotenv.config();

const { users } = model;
/**
 * @description - This class takes care of authenticating a user
 * @returns {class}
 */
class Auth {
  /**
   * @param {object} req - request object
   * @param {object} res - response object
   * @return {object} users data
   */
  static async signUp(req, res) {
    const {
      email, password, username, role
    } = req.body;

    const genSalt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, genSalt);

    try {
      const newUser = await users.create({
        role,
        password: hashedPassword,
        email,
        username
      });

      const token = generateToken(email, newUser.dataValues.id, role, username);
      const payload = {
        status: 201,
        data: {
          message: 'User created successfully',
          token,
        }
      };

      StatusResponse.created(res, payload);
    } catch (error) {
      StatusResponse.internalServerError(res, {
        status: 500,
        data: {
          error: [`Internal server error => ${error}`]
        }
      });
    }
  }

  /**
   * @param {object} req - request object
   * @param {object} res - response object
   * @return {object} users data
   */
  static async login(req, res) {
    const { email, password, username } = req.body;
    let foundUser;
    if (email) {
      foundUser = await findUser('email', email);
    } else {
      foundUser = await findUser('username', username);
    }

    try {
      if (foundUser && !bcrypt.compareSync(password, foundUser.password)) {
        StatusResponse.unauthorized(res, {
          status: 401,
          data: {
            message: 'Invalid email/username or password',
          }
        });
      } else {
        StatusResponse.success(res, {
          status: 200,
          data: {
            message: `Welcome ${foundUser.username}`,
            token: generateToken(email, foundUser.id, foundUser.role, foundUser.username),
          }
        });
      }
    } catch (error) {
      StatusResponse.internalServerError(res, {
        status: 500,
        data: {
          error: [`Internal server error => ${error}`]
        }
      });
    }
  }
}

export default Auth;
