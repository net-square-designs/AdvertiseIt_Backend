import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import dotenv from 'dotenv';
import jwtDecode from 'jwt-decode';
import model from '../models';
import { StatusResponse, findUser } from '../helpers';
import refineServices from '../helpers/refineServices';

dotenv.config();
const { services, users } = model;

/**
 * @description - This class is all about users offered services
 * @param {object} req
 * @param {object} res
 * @returns {class} Services
 */
class Services {
  /**
   * @description - This method takes care of creating a user's service
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} users created service
   */
  static async create(req, res) {
    const token = req.headers.authorization;
    const {
      category, subcategory, title, description, price, days, media, packageoptions, location
    } = req.body;

    const { username } = req.params;

    if (username !== jwtDecode(token).username) {
      StatusResponse.unauthorized(res, {
        status: 401,
        data: {
          error: 'Unauthorized, you cannot create a service on behalf of another user'
        }
      });
    } else {
      try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const createdUsersService = await services.create({
          category,
          subcategory,
          title,
          description,
          price,
          days,
          media,
          packageoptions: JSON.stringify(packageoptions),
          location,
          userId: decoded.userId
        });

        const refinedService = Object.assign(createdUsersService, {
          packageoptions: JSON.parse(createdUsersService.packageoptions)
        });

        StatusResponse.created(res, {
          status: 201,
          data: {
            message: 'Service created successfully',
            service: refinedService
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
  }

  /**
   * @description - This method takes care of updating a user's service
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} users updated service
   */
  static async update(req, res) {
    const token = req.headers.authorization;
    const {
      category, subcategory, title, description, price, days, media, packageoptions, location
    } = req.body;

    const { username, serviceId } = req.params;

    if (username !== jwtDecode(token).username) {
      StatusResponse.unauthorized(res, {
        status: 401,
        data: {
          error: 'Unauthorized, you cannot update a service on behalf of another user'
        }
      });
    } else {
      const returnedService = await services.findOne({
        where: {
          id: serviceId,
          userId: jwtDecode(token).userId
        }
      });

      try {
        jwt.verify(token, process.env.SECRET_KEY);
        if (returnedService) {
          const updatedUsersService = await returnedService.update({
            category: category || returnedService.dataValues.category,
            subcategory: subcategory || returnedService.dataValues.subcategory,
            title: title || returnedService.dataValues.title,
            description: description || returnedService.dataValues.description,
            price: price || returnedService.dataValues.price,
            days: days || returnedService.dataValues.days,
            media: media || returnedService.dataValues.media,
            location: location || returnedService.dataValues.location,
            packageoptions: JSON.stringify(packageoptions)
            || returnedService.dataValues.packageoptions
          });

          const refinedService = Object.assign(updatedUsersService, {
            packageoptions: JSON.parse(updatedUsersService.packageoptions)
          });

          StatusResponse.success(res, {
            status: 200,
            data: {
              message: 'Service updated successfully',
              service: refinedService
            }
          });
        } else {
          StatusResponse.notfound(res, {
            status: 404,
            data: {
              message: 'Service not found',
              service: {}
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

  /**
   * @description - This method takes care of getting a runner services
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} runner services
   */
  static async getAllRunnerServices(req, res) {
    const { username } = req.params;

    const foundUser = await findUser('username', username);
    if (!foundUser) {
      StatusResponse.notfound(res, {
        status: 404,
        data: {
          message: 'Runner not found'
        }
      });
    } else {
      const returnedServices = await services.findAndCountAll({
        where: {
          userId: foundUser.id
        },
        include: [
          {
            model: users,
            as: 'user',
            attributes: { exclude: ['id', 'password', 'createdAt', 'updatedAt', 'role'] }
          }
        ],
        attributes: { exclude: ['userId'] },
        order: [['id', 'DESC']]
      });

      const refinedServices = refineServices(returnedServices);

      StatusResponse.success(res, {
        status: 200,
        data: {
          message: 'All runner services returned successfully',
          services: refinedServices
        }
      });
    }
  }

  /**
   * @description - This method takes care of getting a specific runner services
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} specific runner services
   */
  static async getSpecificRunnerServices(req, res) {
    const { username, serviceId } = req.params;

    const foundUser = await findUser('username', username);
    if (!foundUser) {
      StatusResponse.notfound(res, {
        status: 404,
        data: {
          message: 'Runner not found'
        }
      });
    } else {
      const returnedServices = await services.findAndCountAll({
        where: {
          id: serviceId,
          userId: foundUser.id
        },
        include: [
          {
            model: users,
            as: 'user',
            attributes: { exclude: ['id', 'password', 'createdAt', 'updatedAt', 'role'] }
          }
        ],
        attributes: { exclude: ['userId'] },
      });

      const refinedServices = refineServices(returnedServices);

      StatusResponse.success(res, {
        status: 200,
        data: {
          message: 'Specific runner services returned successfully',
          services: refinedServices
        }
      });
    }
  }

  /**
   * @description - This method takes care of getting all services created by all runners
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} all runners services
   */
  static async getAllRunnersServices(req, res) {
    const returnedServices = await services.findAndCountAll({
      include: [
        {
          model: users,
          as: 'user',
          attributes: { exclude: ['id', 'password', 'createdAt', 'updatedAt', 'role'] }
        }
      ],
      attributes: { exclude: ['userId'] },
      order: [['id', 'DESC']]
    });

    const refinedServices = refineServices(returnedServices);

    StatusResponse.success(res, {
      status: 200,
      data: {
        message: 'All runners services returned successfully',
        services: refinedServices
      }
    });
  }

  /**
   * @description - This method takes care of searching for services based on some parameters
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} services matching some parameters
   */
  static async search(req, res) {
    const { query } = req.query;
    const returnedServices = await services.findAndCountAll({
      where: {
        [Op.or]: {
          category: { [Op.iLike]: `%${query}%` },
          subcategory: { [Op.iLike]: `%${query}%` },
          title: { [Op.iLike]: `%${query}%` },
          description: { [Op.iLike]: `%${query}%` },
          price: Number(query) ? query : null,
          location: { [Op.iLike]: `%${query}%` },
        }
      },
      include: [
        {
          model: users,
          as: 'user',
          attributes: { exclude: ['id', 'password', 'createdAt', 'updatedAt', 'role'] }
        }
      ],
      attributes: { exclude: ['userId'] },
      order: [['id', 'DESC']]
    });

    if (returnedServices.count > 0) {
      const refinedServices = refineServices(returnedServices);

      StatusResponse.success(res, {
        status: 200,
        data: {
          message: 'Searched services returned successfully',
          services: refinedServices
        }
      });
    } else {
      StatusResponse.notfound(res, {
        status: 404,
        data: {
          message: 'No services matching the searched parameter',
          services: {}
        }
      });
    }
  }
}

export default Services;
