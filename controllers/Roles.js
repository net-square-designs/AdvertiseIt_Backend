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
   * from customer-merchant to influencer and vice versa
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} switched user
   */
  static async switchRole(req, res) {
    try {
      const { username } = req.params;
      const { role } = req.body;

      if (username !== req.decoded.username) {
        StatusResponse.unauthorized(res, {
          status: 401,
          data: {
            error: "Unauthorized, you cannot switch another person's role"
          }
        });
      } else if (role !== 'customer-merchant') {
        StatusResponse.badRequest(res, {
          status: 400,
          data: {
            error: 'role must be customer-merchant'
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
            message: "User's role switched successfully",
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
