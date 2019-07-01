/* eslint-disable import/no-cycle */
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Op } from 'sequelize';
import model from '../models';
import { StatusResponse, createNotifications, triggerEvent } from '../helpers';

dotenv.config();
const { messages } = model;

/**
 * @description - This class is all about messaging
 * @param {object} req
 * @param {object} res
 * @returns {class} Messages
 */
class Messages {
  /**
   * @description - This method takes care of sending a user a message
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} sent message
   */
  static async send(req, res) {
    const token = req.headers.authorization;
    const { message } = req.body;
    const { username } = req.params;

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      if (username === decoded.username) {
        StatusResponse.forbidden(res, {
          status: 403,
          data: {
            message: 'Forbidden, you cannot send a message to yourself',
          }
        });
      } else {
        const sentMessage = await messages.create({
          message,
          senderusername: decoded.username,
          receiverusername: username
        });
        const notification = await createNotifications(sentMessage, 'message');
        triggerEvent(sentMessage, 'message_sent', notification);

        // Server Response
        StatusResponse.created(res, {
          status: 201,
          data: {
            message: 'Message sent successfully',
            sentMessage,
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
   * @description - This method takes care of retrieving user's messages
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} messages
   */
  static async retrieveAllConversation(req, res) {
    const token = req.headers.authorization;

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const retrievedMessages = await messages.findAndCountAll({
        where: {
          [Op.or]: {
            receiverusername: decoded.username,
            senderusername: decoded.username
          }
        },
        order: [['id', 'DESC']]
      });

      if (retrievedMessages.count > 0) {
        StatusResponse.success(res, {
          status: 200,
          data: {
            message: "All user's messages returned successfully",
            retrievedMessages
          }
        });
      } else {
        StatusResponse.notfound(res, {
          status: 404,
          data: {
            message: 'User have not received any messages yet',
            retrievedMessages
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
   * @description - This method takes care of retrieving user's conversation with one other person
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} messages
   */
  static async retrieveConversation(req, res) {
    const token = req.headers.authorization;
    const { username } = req.params;

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const retrievedMessages = await messages.findAndCountAll({
        where: {
          senderusername: {
            [Op.or]: [decoded.username, username]
          },
          receiverusername: {
            [Op.or]: [username, decoded.username]
          }
        },
        order: [['id', 'DESC']]
      });

      if (retrievedMessages.count > 0) {
        StatusResponse.success(res, {
          status: 200,
          data: {
            message: "User's conversation with this person returned successfully",
            retrievedMessages
          }
        });
      } else {
        StatusResponse.notfound(res, {
          status: 404,
          data: {
            message: 'User have no conversation with this person'
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
   * @description - This method takes care of updating the status of user's
   * conversation with one other person
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object}
   */
  static async updateConversation(req, res) {
    const token = req.headers.authorization;
    const { username } = req.params;

    try {
      jwt.verify(token, process.env.SECRET_KEY);
      const updatedConversation = await messages.update({
        isread: true
      },
      {
        where: {
          senderusername: username
        }
      });

      if (updatedConversation[0] > 0) {
        StatusResponse.success(res, {
          status: 200,
          data: {
            message: "User's read status for this conversation with this person updated successfully"
          }
        });
      } else {
        StatusResponse.notfound(res, {
          status: 404,
          data: {
            message: 'User have no conversation with this person'
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
   * @description - This method takes care of helping a user delete a conversation
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {void}
   */
  static async deleteConversation(req, res) {
    const token = req.headers.authorization;
    const { username } = req.params;

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const messagesDeleted = await messages.destroy({
        where: {
          senderusername: {
            [Op.or]: [decoded.username, username]
          },
          receiverusername: {
            [Op.or]: [username, decoded.username]
          }
        },
      });
      if (messagesDeleted) {
        StatusResponse.success(res, {
          status: 200,
          data: {
            message: 'Conversation deleted successfully'
          }
        });
      } else {
        StatusResponse.notfound(res, {
          status: 404,
          data: {
            message: 'No conversation found'
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
   * @description - This method takes care of helping a user delete all conversation
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {void}
   */
  static async deleteAllConversation(req, res) {
    const token = req.headers.authorization;

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const messagesDeleted = await messages.destroy({
        where: {
          [Op.or]: {
            senderusername: decoded.username,
            receiverusername: decoded.username
          }
        }
      });
      if (messagesDeleted) {
        StatusResponse.success(res, {
          status: 200,
          data: {
            message: 'All Conversation deleted successfully'
          }
        });
      } else {
        StatusResponse.notfound(res, {
          status: 404,
          data: {
            message: 'No conversation found'
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

export default Messages;
