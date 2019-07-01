/* eslint-disable import/no-cycle */
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import dotenv from 'dotenv';
import jwtDecode from 'jwt-decode';
import model from '../models';
import {
  StatusResponse, findUser, triggerEvent,
  createOrderNotifications, createUpdateTaskNotifications,
  createUpdateOrderNotifications
} from '../helpers';
import refineServices from '../helpers/refineServices';

dotenv.config();
const {
  services, users, orders
} = model;

/**
 * @description - This class is all about customers orders
 * @param {object} req
 * @param {object} res
 * @returns {class} Orders
 */
class Orders {
  /**
   * @description - This method takes care of creating a customer's order
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} cuatomer's created order
   */
  static async create(req, res) {
    const token = req.headers.authorization;
    const {
      category, title, description, budget, duedate, deliverylocation, quantity
    } = req.body;

    const { username } = req.params;

    const serviceRunners = await services.findAndCountAll({
      where: {
        location: { [Op.iLike]: `%${deliverylocation}%` },
        category: { [Op.iLike]: `%${category}%` }
      },
      include: [
        {
          model: users,
          as: 'user',
          attributes: { exclude: ['id', 'password', 'createdAt', 'updatedAt'] }
        }
      ],
      attributes: { exclude: ['userId'] }
    });

    if (username !== jwtDecode(token).username) {
      StatusResponse.unauthorized(res, {
        status: 401,
        data: {
          error: 'Unauthorized, you cannot create an order on behalf of another user'
        }
      });
    } else if (jwtDecode(token).role !== 'customer') {
      StatusResponse.forbidden(res, {
        status: 403,
        data: {
          error: 'Forbidden, only a customer can make an order, please consider switching to customer mode'
        }
      });
    } else if (serviceRunners.count < 1) {
      StatusResponse.notfound(res, {
        status: 404,
        data: {
          message: 'No runners found close to your location or that can handle the service you are requesting, please choose another location or service',
        }
      });
    } else {
      const assignedServiceRunnerId = Math.floor(Math.random() * serviceRunners.count);
      const refinedServiceRunners = refineServices(serviceRunners);

      try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const order = await orders.create({
          category,
          title,
          description,
          budget,
          duedate,
          deliverylocation,
          quantity,
          customerusername: decoded.username,
          runnerusername: refinedServiceRunners[assignedServiceRunnerId].user.username
        });

        const notification = await createOrderNotifications(order, 'order');
        triggerEvent(order, 'order_received', notification);

        StatusResponse.created(res, {
          status: 201,
          data: {
            message: 'Order created successfully',
            order
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
   * @description - This method takes care of updating the status of a runner's task
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} runner's updated task
   */
  static async updateStatusOfTask(req, res) {
    const token = req.headers.authorization;
    const {
      status
    } = req.body;

    const { username, taskId } = req.params;

    if (username !== jwtDecode(token).username) {
      StatusResponse.unauthorized(res, {
        status: 401,
        data: {
          error: 'Unauthorized, you cannot update the status of a task on behalf of another runner'
        }
      });
    } else if (jwtDecode(token).role !== 'runner') {
      StatusResponse.forbidden(res, {
        status: 403,
        data: {
          error: 'Forbidden, only a runner can update the status of a task, please consider switching to runner mode'
        }
      });
    } else {
      try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const updatedTask = await orders.update({
          status
        },
        {
          where: {
            id: taskId,
            runnerusername: decoded.username
          }
        });
        if (updatedTask[0] > 0) {
          const payload = await orders.findOne({
            where: {
              id: taskId
            }
          });

          const notification = await createUpdateTaskNotifications(payload.dataValues, 'task_update');
          triggerEvent(payload.dataValues, 'task_status_updated', notification);

          StatusResponse.success(res, {
            status: 200,
            data: {
              message: 'The status of this task updated successfully'
            }
          });
        } else {
          StatusResponse.notfound(res, {
            status: 404,
            data: {
              message: 'Runner have no assigned task yet'
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
   * @description - This method takes care of updating the status of a customer's order
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} customer's updated order
   */
  static async updateStatusOfOrder(req, res) {
    const token = req.headers.authorization;
    const {
      status
    } = req.body;

    const { username, orderId } = req.params;

    if (username !== jwtDecode(token).username) {
      StatusResponse.unauthorized(res, {
        status: 401,
        data: {
          error: 'Unauthorized, you cannot update the status of an order on behalf of another customer'
        }
      });
    } else if (jwtDecode(token).role !== 'customer') {
      StatusResponse.forbidden(res, {
        status: 403,
        data: {
          error: 'Forbidden, only a customer can update the status of an order, please consider switching to customer mode'
        }
      });
    } else {
      try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const updatedOrder = await orders.update({
          status
        },
        {
          where: {
            id: orderId,
            customerusername: decoded.username
          }
        });

        if (updatedOrder[0] > 0) {
          const payload = await orders.findOne({
            where: {
              id: orderId
            }
          });

          const notification = await createUpdateOrderNotifications(payload.dataValues, 'order_update');
          triggerEvent(payload.dataValues, 'order_status_updated', notification);

          StatusResponse.success(res, {
            status: 200,
            data: {
              message: 'The status of this order updated successfully'
            }
          });
        } else {
          StatusResponse.notfound(res, {
            status: 404,
            data: {
              message: 'Customer have not made an order yet'
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
   * @description - This method takes care of getting a runner's tasks
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} runner's tasks
   */
  static async getAllRunnersTasks(req, res) {
    const token = req.headers.authorization;
    const { username } = req.params;

    const foundUser = await findUser('username', username);
    if (!foundUser) {
      StatusResponse.notfound(res, {
        status: 404,
        data: {
          message: 'Runner not found'
        }
      });
    } else if (jwtDecode(token).role !== 'runner') {
      StatusResponse.forbidden(res, {
        status: 403,
        data: {
          error: 'Forbidden, only a runner can retrieve tasks, please consider switching to runner mode'
        }
      });
    } else if (username !== jwtDecode(token).username) {
      StatusResponse.unauthorized(res, {
        status: 401,
        data: {
          error: "Unauthorized, you cannot retrieve another runner's tasks"
        }
      });
    } else {
      try {
        jwt.verify(token, process.env.SECRET_KEY);
        const tasks = await orders.findAndCountAll({
          where: {
            runnerusername: username
          }
        });

        if (tasks.count > 0) {
          StatusResponse.success(res, {
            status: 200,
            data: {
              message: "All runner's tasks returned successfully",
              tasks
            }
          });
        } else {
          StatusResponse.notfound(res, {
            status: 404,
            data: {
              message: 'Runner have no assigned task yet',
              tasks: {}
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
   * @description - This method takes care of getting a specific runner's task
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} runner's task
   */
  static async getSpecificRunnersTask(req, res) {
    const token = req.headers.authorization;
    const { username, taskId } = req.params;

    const foundUser = await findUser('username', username);
    if (!foundUser) {
      StatusResponse.notfound(res, {
        status: 404,
        data: {
          message: 'Runner not found'
        }
      });
    } else if (jwtDecode(token).role !== 'runner') {
      StatusResponse.forbidden(res, {
        status: 403,
        data: {
          error: 'Forbidden, only a runner can retrieve tasks, please consider switching to runner mode'
        }
      });
    } else if (username !== jwtDecode(token).username) {
      StatusResponse.unauthorized(res, {
        status: 401,
        data: {
          error: "Unauthorized, you cannot retrieve another runner's task"
        }
      });
    } else {
      try {
        jwt.verify(token, process.env.SECRET_KEY);
        const task = await orders.findAndCountAll({
          where: {
            runnerusername: username,
            id: taskId
          }
        });

        if (task.count > 0) {
          StatusResponse.success(res, {
            status: 200,
            data: {
              message: "Specific runner's task returned successfully",
              task
            }
          });
        } else {
          StatusResponse.notfound(res, {
            status: 404,
            data: {
              message: 'Runner have no assigned task yet',
              tasks: {}
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
   * @description - This method takes care of getting a runner's tasks
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} runner's tasks
   */
  static async getAllCustomerOrderHistory(req, res) {
    const token = req.headers.authorization;
    const { username } = req.params;

    const foundUser = await findUser('username', username);
    if (!foundUser) {
      StatusResponse.notfound(res, {
        status: 404,
        data: {
          message: 'Customer not found'
        }
      });
    } else if (jwtDecode(token).role !== 'customer') {
      StatusResponse.forbidden(res, {
        status: 403,
        data: {
          error: 'Forbidden, only a customer can retrieve orders, please consider switching to customer mode'
        }
      });
    } else if (username !== jwtDecode(token).username) {
      StatusResponse.unauthorized(res, {
        status: 401,
        data: {
          error: "Unauthorized, you cannot retrieve another customer's orders"
        }
      });
    } else {
      try {
        jwt.verify(token, process.env.SECRET_KEY);
        const order = await orders.findAndCountAll({
          where: {
            customerusername: username
          }
        });

        if (order.count > 0) {
          StatusResponse.success(res, {
            status: 200,
            data: {
              message: "All customer's orders returned successfully",
              order
            }
          });
        } else {
          StatusResponse.notfound(res, {
            status: 404,
            data: {
              message: 'Customer have not made an order yet',
              tasks: {}
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
   * @description - This method takes care of deleting an order
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {void}
   */
  static async delete(req, res) {
    const token = req.headers.authorization;
    const { orderId } = req.params;

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      if (decoded.role !== 'customer') {
        StatusResponse.forbidden(res, {
          status: 403,
          data: {
            message: 'Forbidden, only a customer can delete orders'
          }
        });
      } else {
        const deletedOrder = await orders.findOne({
          where: {
            id: orderId,
            customerusername: decoded.username
          }
        });
        if (deletedOrder) {
          await deletedOrder.destroy({});
          StatusResponse.success(res, {
            status: 200,
            data: {
              message: 'Order deleted successfully'
            }
          });
        } else {
          StatusResponse.notfound(res, {
            status: 404,
            data: {
              message: 'Order not found',
              order: {}
            }
          });
        }
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

export default Orders;
