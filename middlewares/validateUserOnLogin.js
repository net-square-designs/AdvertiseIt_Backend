/* eslint-disable import/no-cycle */
// Packages
import emailvalidator from 'email-validator';
// Helpers
import { StatusResponse } from '../helpers';

// This function validates input from a user
const validateUserOnLogin = (req, res, next) => {
  const {
    email, password, username
  } = req.body;

  if ((!email && !username) || !password) {
    StatusResponse.badRequest(res, {
      status: 400,
      data: {
        error: {
          emailOrUsername: (!email && !username) ? 'email or username must be filled' : '',
          password: !password ? 'password must be filled' : '',
        }
      }
    });
  } else if (email && !emailvalidator.validate(email)) {
    StatusResponse.badRequest(res, {
      status: 400,
      data: {
        error: {
          email: 'Invalid email',
        }
      }
    });
  } else {
    return next();
  }
};

export default validateUserOnLogin;
