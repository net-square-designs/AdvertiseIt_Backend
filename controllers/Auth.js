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
          error: 'Internal server error'
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
          error: 'Internal server error'
        }
      });
    }
  }

  /**
   * @param {object} req - request object
   * @param {object} res - response object
   * @return {void}
   */
  static async social(req, res) {
    res.redirect(`OAuthLogin://login?user=${JSON.stringify(req.socialUser)}`);
  }

  /**
   * @param {object} req - request object
   * @param {object} res - response object
   * @return {object} users data
   */
  static async socialAuth(req, res) {
    const { email, username, roleChangedTo } = req.body;

    const foundSocialUser = await users.findOne({
      where: {
        email,
      }
    });

    const foundUser = await findUser('email', email);

    if (foundSocialUser && roleChangedTo === 'influencer') {
      await foundSocialUser.update({
        role: 'influencer'
      });

      const token = await generateToken(foundSocialUser.dataValues.email,
        foundSocialUser.dataValues.id,
        'influencer', foundSocialUser.dataValues.username,
        foundSocialUser.dataValues.productsofinterest);
      const payload = {
        status: 200,
        data: {
          message: "User's role updated successfully to an influencer",
          token,
        }
      };
      StatusResponse.success(res, payload);
    } else if (foundUser) {
      StatusResponse.success(res, {
        status: 200,
        data: {
          message: `Welcome ${foundUser.username}`,
          token: generateToken(foundUser.email, foundUser.id, foundUser.role, foundUser.username,
            foundUser.productsofinterest),
        }
      });
    } else {
      const newUser = await users.create({
        role: 'customer-merchant',
        password: '',
        email,
        username,
        productsofinterest: ['sports', 'tech', 'music', 'apple', 'android', 'clothing', 'gadgets', 'nike', 'home', 'phones', 'computer']
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

export default Auth;
