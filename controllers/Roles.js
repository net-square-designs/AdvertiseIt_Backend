import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import model from '../models';
import { StatusResponse } from '../helpers';

dotenv.config();
const { users } = model;
/**
 * @description - This class is all about users roles switching
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns {class}
 */
class Roles {
  /**
   * @description - This method takes care of switching  a user's role
   * from runner to customer and vice versa
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} switched user
   */
  static async switchRole(req, res) {
    try {
      const token = req.headers.authorization;
      const { username } = req.params;
      const { role } = req.body;

      if (username !== jwt.verify(token, process.env.SECRET_KEY).username) {
        StatusResponse.unauthorized(res, {
          status: 401,
          data: {
            error: "Unauthorized, you cannot switch another person's role"
          }
        });
      } else if (role !== 'runner' && role !== 'customer') {
        StatusResponse.badRequest(res, {
          status: 400,
          data: {
            error: 'role must be runner or customer'
          }
        });
      } else {
        users.update({
          role
        },
        {
          where: {
            username
          }
        });

        StatusResponse.success(res, {
          status: 200,
          data: {
            message: 'Users role switched succesfully',
          }
        });
      }
    } catch (error) {
      StatusResponse.internalServerError(res, {
        status: 500,
        data: {
          error: `Internal server error => ${error}`
        }
      });
    }
  }
}

export default Roles;
