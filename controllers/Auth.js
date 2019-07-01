/* eslint-disable no-underscore-dangle */
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
      email, password, username, role, productsofinterest
    } = req.body;

    const genSalt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, genSalt);

    try {
      const newUser = await users.create({
        role,
        password: hashedPassword,
        email,
        username,
        productsofinterest
      });

      const token = generateToken(email, newUser.dataValues.id, role, username, productsofinterest);
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
            token: generateToken(email, foundUser.id, foundUser.role, foundUser.username,
              foundUser.productsofinterest),
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

  /**
   * @param {object} req - request object
   * @param {object} res - response object
   * @return {object} users data
   */
  static async social(req, res) {
    const foundUser = await findUser('email', req.socialUser.emails[0].value);

    if (foundUser) {
      StatusResponse.success(res, {
        status: 200,
        data: {
          message: `Welcome ${foundUser.username}`,
          token: generateToken(foundUser.email, foundUser.id, foundUser.role, foundUser.username,
            foundUser.productsofinterest),
        }
      });
    } else {
      const { role, productsofinterest } = req.body;
      if (!role || !productsofinterest) {
        StatusResponse.badRequest(res, {
          status: 400,
          data: {
            error: {
              role: !role ? 'role must be filled' : '',
              productsofinterest: !productsofinterest ? 'products of interest must be filled' : '',
            }
          }
        });
      } else if (role !== 'customer-merchant' && role !== 'influencer') {
        StatusResponse.badRequest(res, {
          status: 400,
          data: {
            error: 'role must be customer-merchant or influencer'
          }
        });
      } else if (!Array.isArray(productsofinterest)) {
        StatusResponse.badRequest(res, {
          status: 400,
          data: {
            error: 'products of interest must be an array'
          }
        });
      } else if (req.socialUser._json.friends.summary.total_count < 200) {
        StatusResponse.forbidden(res, {
          status: 403,
          data: {
            error: 'Sorry, you cannot be an influencer on this platform, your friends list is less than 200 friends'
          }
        });
      } else {
        const newUser = await users.create({
          role,
          password: '',
          email: req.socialUser.emails[0].value,
          username: req.socialUser.emails[0].value,
          productsofinterest
        });

        const token = await generateToken(newUser.dataValues.email, newUser.dataValues.id,
          newUser.dataValues.role, newUser.dataValues.username,
          newUser.dataValues.productsofinterest);
        const payload = {
          status: 201,
          data: {
            message: 'User created successfully',
            token,
          }
        };
        StatusResponse.created(res, payload);
      }
    }
  }
}

export default Auth;
