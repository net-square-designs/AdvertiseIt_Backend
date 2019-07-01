/* eslint-disable import/no-cycle */
// Helpers
import { StatusResponse } from '../helpers';

// This function validates input from a user
const validateMessagesInput = (req, res, next) => {
  const { message } = req.body;

  if (!message) {
    StatusResponse.badRequest(res, {
      status: 400,
      data: {
        error: {
          message: !message ? 'message field cannot be left blank' : '',
        }
      }
    });
  } else {
    return next();
  }
};

export default validateMessagesInput;
