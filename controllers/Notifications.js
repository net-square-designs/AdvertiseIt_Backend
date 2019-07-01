import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import model from '../models';
import { StatusResponse } from '../helpers';

dotenv.config();
const { notifications } = model;

/**
 * @description - This class is all about users notifications
 * @param {object} req
 * @param {object} res
 * @returns {class} Notifications
 */
class Notifications {
  /**
   * @description - This method takes care of getting a user's notifications
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} user's notifications
   */
  static async retrieveAll(req, res) {
    const token = req.headers.authorization;

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const allNotifications = await notifications.findAndCountAll({
        where: {
          receiverusername: decoded.username
        },
        order: [['id', 'DESC']]
      });

      if (allNotifications.count > 0) {
        StatusResponse.success(res, {
          status: 200,
          data: {
            message: 'Notifications returned successfully',
            allNotifications
          }
        });
      } else {
        StatusResponse.notfound(res, {
          status: 404,
          data: {
            message: "You don't have any notifications yet",
            allNotifications: {}
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
   * @description - This method takes care of getting one of user's notification
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} user's notification
   */
  static async retrieveOne(req, res) {
    const token = req.headers.authorization;
    const { notificationId } = req.params;

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const notification = await notifications.findAndCountAll({
        where: {
          id: notificationId,
          receiverusername: decoded.username
        }
      });

      if (notification.count > 0) {
        StatusResponse.success(res, {
          status: 200,
          data: {
            message: 'Notification returned successfully',
            notification
          }
        });
      } else {
        StatusResponse.notfound(res, {
          status: 404,
          data: {
            message: "You don't have any notifications yet",
            notification: {}
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
   * @description - This method takes care of updating a user's notification isread status to true
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} user's updated notification
   */
  static async update(req, res) {
    const token = req.headers.authorization;

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const updatedNotification = await notifications.update({
        isread: true
      },
      {
        where: {
          receiverusername: decoded.username
        }
      });

      if (updatedNotification[0] > 0) {
        StatusResponse.success(res, {
          status: 200,
          data: {
            message: "User's read status for these notifications updated successfully"
          }
        });
      } else {
        StatusResponse.notfound(res, {
          status: 404,
          data: {
            message: 'User have no notifications yet'
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
   * @description - This method takes care of helping a user delete his notifications
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {void}
   */
  static async delete(req, res) {
    const token = req.headers.authorization;
    const { notificationId } = req.params;

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const deletedNotification = await notifications.findOne({
        where: {
          id: notificationId,
          receiverusername: decoded.username
        }
      });
      if (deletedNotification) {
        await deletedNotification.destroy({});
        StatusResponse.success(res, {
          status: 200,
          data: {
            message: 'Notification deleted successfully'
          }
        });
      } else {
        StatusResponse.notfound(res, {
          status: 404,
          data: {
            message: 'Notification not found',
            notification: {}
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

export default Notifications;
