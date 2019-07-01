import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import model from '../models';
import { StatusResponse } from '../helpers';

dotenv.config();

const {
  bookmarks, users, services
} = model;

/**
 * @description - This class is all about users bookmarked services
 * @param {object} req
 * @param {object} res
 * @returns {class} Bookmarked Services
 */
class Bookmarks {
  /**
   * @description - This method takes care of helping a user bookmark services
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} user's bookmarked services
   */
  static async create(req, res) {
    const { title } = req.body;
    const { serviceId } = req.params;
    const token = req.headers.authorization;

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      await bookmarks.create({
        title,
        userId: decoded.userId,
        serviceId
      });

      const refinedBookmarkedServices = await bookmarks.findOne({
        where: {
          userId: decoded.userId,
          serviceId
        },
        include: [{
          model: services,
          as: 'service',
          attributes: { exclude: ['id', 'userId'] }
        }, {
          model: users,
          as: 'user',
          attributes: { exclude: ['id', 'password', 'createdAt', 'updatedAt', 'role'] }
        }],
        order: [['id', 'DESC']]
      });

      const refinedServices = await [refinedBookmarkedServices.service].map((eachService) => {
        const parsedOptions = JSON.parse(eachService.dataValues.packageoptions);
        return Object.assign(eachService.dataValues, {
          packageoptions: parsedOptions
        });
      });

      StatusResponse.created(res, {
        status: 201,
        data: {
          message: 'Services bookmarked successfully',
          bookmark: Object.assign(refinedBookmarkedServices, {
            service: refinedServices
          })
        }
      });
    } catch (error) {
      StatusResponse.unauthorized(res, {
        status: 401,
        data: {
          error: 'Unauthorized, user not authenticated'
        }
      });
    }
  }

  /**
   * @description - This method takes care of helping a user search
   * for bookmarked services based on search parameters
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} user's bookmarked services
   */
  static async search(req, res) {
    const { query } = req.query;
    const token = req.headers.authorization;

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const bookmarkedServices = await bookmarks.findAndCountAll({
        where: {
          title: { [Op.iLike]: `%${query}%` },
          userId: decoded.userId,
        },
        include: [{
          model: services,
          as: 'service',
          attributes: { exclude: ['id', 'userId'] }
        }, {
          model: users,
          as: 'user',
          attributes: { exclude: ['id', 'password', 'createdAt', 'updatedAt', 'role'] }
        }],
        order: [['id', 'DESC']]
      });

      await bookmarkedServices.rows.map((eachService) => {
        const parsedOptions = JSON.parse(eachService.dataValues.service.packageoptions);
        return Object.assign(eachService.dataValues.service, {
          packageoptions: parsedOptions
        });
      });

      if (bookmarkedServices.count > 0) {
        StatusResponse.success(res, {
          status: 200,
          data: {
            message: 'Bookmarked services returned successfully',
            bookmark: bookmarkedServices
          }
        });
      } else {
        StatusResponse.notfound(res, {
          status: 404,
          data: {
            message: 'No bookmarked services found',
            bookmark: {}
          }
        });
      }
    } catch (error) {
      StatusResponse.unauthorized(res, {
        status: 401,
        data: {
          error: 'Unauthorized, user not authenticated'
        }
      });
    }
  }

  /**
   * @description - This method takes care of helping a user retrieve all his bookmarked services
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} user's bookmarked services
   */
  static async retrieve(req, res) {
    const token = req.headers.authorization;

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const bookmarkedServices = await bookmarks.findAndCountAll({
        where: {
          userId: decoded.userId
        },
        include: [{
          model: services,
          as: 'service',
          attributes: { exclude: ['id', 'userId'] }
        }, {
          model: users,
          as: 'user',
          attributes: { exclude: ['id', 'password', 'createdAt', 'updatedAt', 'role'] }
        }],
        order: [['id', 'DESC']]
      });

      await bookmarkedServices.rows.map((eachService) => {
        const parsedOptions = JSON.parse(eachService.dataValues.service.packageoptions);
        return Object.assign(eachService.dataValues.service, {
          packageoptions: parsedOptions
        });
      });


      if (bookmarkedServices.count > 0) {
        StatusResponse.success(res, {
          status: 200,
          data: {
            message: 'Bookmarked services returned successfully',
            bookmark: bookmarkedServices
          }
        });
      } else {
        StatusResponse.notfound(res, {
          status: 404,
          data: {
            message: 'No bookmarked services found',
            bookmark: {}
          }
        });
      }
    } catch (error) {
      StatusResponse.unauthorized(res, {
        status: 401,
        data: {
          error: 'Unauthorized, user not authenticated'
        }
      });
    }
  }

  /**
   * @description - This method takes care of helping a user delete his bookmarked services
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {void}
   */
  static async delete(req, res) {
    const token = req.headers.authorization;
    const { serviceId } = req.params;

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const bookmarkedServices = await bookmarks.findOne({
        where: {
          serviceId,
          userId: decoded.userId
        }
      });
      if (bookmarkedServices) {
        await bookmarkedServices.destroy({});
        StatusResponse.success(res, {
          status: 200,
          data: {
            message: 'Bookmarked services deleted successfully'
          }
        });
      } else {
        StatusResponse.notfound(res, {
          status: 404,
          data: {
            message: 'No bookmarked services found',
            bookmark: {}
          }
        });
      }
    } catch (error) {
      StatusResponse.unauthorized(res, {
        status: 401,
        data: {
          error: 'Unauthorized, user not authenticated'
        }
      });
    }
  }
}

export default Bookmarks;
